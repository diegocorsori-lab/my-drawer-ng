import { Application, View, Color, action, GestureEventData } from '@nativescript/core';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { LibrosService, Libro } from '../services/libros.service';
import { RouterExtensions } from '@nativescript/angular';
// 1. IMPORTAMOS EL PLUGIN DE SOCIAL SHARE
import * as SocialShare from '@nativescript/social-share';

@Component({
  selector: 'Search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit, AfterViewInit {
  
  @ViewChild('layout') layout: ElementRef;
  textoBusqueda: string = '';
  resultados: Array<Libro> = [];
  
  librosMock = {
    buscar: () => {
      return ["Cien años de soledad", "Don Quijote de la Mancha", "El Aleph"]; 
    }
  };

  constructor(private librosService: LibrosService, private routerExtensions: RouterExtensions) {}

  ngOnInit(): void {
    this.cargarResultados('');
  }
  
  cargarResultados(busqueda: string): void {
    this.librosService.buscar(busqueda).subscribe({
      next: (datosDelServidor: Libro[]) => {
        this.resultados = datosDelServidor;
      },
      error: (error) => {
        console.error('Error al obtener los resultados:', error);
      }
    });
  }

  ngAfterViewInit(): void {
    const layout = <View>this.layout.nativeElement;
    layout.animate({
        backgroundColor: new Color("blue"),
        duration: 3000,
        delay: 1500
    }).then(() => layout.animate({
        backgroundColor: new Color("white"),
        duration: 3000,
        delay: 1500
    }));
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }

  onItemTap(x: any): void {
    console.dir(x);
  }

  buscarAhora(s: string) {
    this.cargarResultados(s);
  }

  irADetalle(idLibro: number): void {
      this.routerExtensions.navigate(['/detalle', idLibro]);
  }

  async onItemLongPress(args: GestureEventData, libro: Libro) {
    const vista = <View>args.object;

    await vista.animate({
        backgroundColor: new Color("#C5CAE9"),
        duration: 300
    });
    await vista.animate({
        backgroundColor: new Color("transparent"),
        duration: 300
    });

    const respuesta = await action({
        title: "Opciones del Libro",
        message: `¿Qué deseas hacer con "${libro.titulo}"?`,
        cancelButtonText: "Cancelar",
        actions: ["Archivar", "Borrar", "Compartir en Redes"] // Añadimos opción aquí también si gustas
    });

    if (respuesta === "Borrar") {
        this.resultados = this.resultados.filter(item => item.id !== libro.id);
    } else if (respuesta === "Archivar") {
        this.librosService.archivar(libro);
        this.resultados = this.resultados.filter(item => item.id !== libro.id);
    } else if (respuesta === "Compartir en Redes") {
        this.compartirLibroRedes(libro);
    }
  }

  favoritosGuardados: Array<Libro> = [];

  async agregarAFavoritos(libro: Libro) {
    try {
      await this.librosService.guardarFavorito(libro.titulo);
      console.log(`"${libro.titulo}" guardado exitosamente en SQLite (Favoritos).`);
      this.cargarFavoritos();
    } catch (error) {
      console.error("Error al guardar en favoritos:", error);
    }
  }

  async cargarFavoritos() {
    try {
      const listaFavoritosDB = await this.librosService.obtenerFavoritosDB();
      this.favoritosGuardados = listaFavoritosDB; 
      console.log("Favoritos obtenidos de SQLite:", this.favoritosGuardados);
    } catch (error) {
      console.error("Error al consultar la tabla de favoritos:", error);
    }
  }

  // 2. NUEVO MÉTODO PARA COMPARTIR UN LIBRO USANDO EL PLUGIN
  compartirLibroRedes(libro: Libro): void {
  if (!libro || !libro.titulo) return; // Evita errores si llega indefinido
  const textoCompartir = `¡Hola! Te recomiendo este título de la librería: "${libro.titulo}". 📖✨`;
  SocialShare.shareText(textoCompartir);
  }

  onRefresh(e: any): void {
    const pullRefresh = e.object;
    
    this.librosService.buscar('').subscribe({
      next: (librosFiltrados) => {
        this.resultados = librosFiltrados;
        pullRefresh.refreshing = false; 
      },
      error: (err) => {
        console.error("Error al recargar:", err);
        pullRefresh.refreshing = false;
      }
    });
  }
}