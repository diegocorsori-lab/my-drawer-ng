import { Component, OnInit } from '@angular/core';
import { isAndroid, View, Color, action, GestureEventData, Application } from '@nativescript/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { LibrosService, Libro } from '../services/libros.service';
import { Router } from '@angular/router';
import { SearchBar } from '@nativescript/core';


@Component({
  selector: 'ns-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css'],
})
export class LibrosComponent implements OnInit {
  librosList: Libro[] = [];
  mensajeAndroid: string = 'Ejecutando en sistema general';

  constructor(private librosService: LibrosService,private router: Router) {}

  ngOnInit(): void {
    // Cargamos la lista inicial desde el servicio
    this.cargarLibros();
    if (isAndroid) {
      this.mensajeAndroid = 'Modo Android Activo';
    }
  }

  cargarLibros(busqueda: string = ''): void {
    this.librosService.buscar(busqueda).subscribe({
      next: (datosDelServidor: Libro[]) => {
        // Actualizamos el estado local. Angular actualizará la vista automáticamente.
        this.librosList = datosDelServidor;
      },
      error: (error) => {
        console.error('Error al obtener los libros del servidor:', error);
      }
    });
  }

onBuscar(args: any): void {
    const searchBar = <SearchBar>args.object;
    // Llama al webservice pasando el texto escrito
    this.cargarLibros(searchBar.text);
    
    // Oculta el teclado nativo después de buscar
    searchBar.dismissSoftInput();
  }

  onLimpiar(): void {
    // Si limpian la barra, traemos todos los libros de nuevo
    this.cargarLibros('');
  }

onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }

irADetalle(idLibro: number): void {
    this.router.navigate(['/detalle', idLibro]);
}


  // Gesto Long Press con animación y diálogo
  async onItemLongPress(args: GestureEventData, libro: Libro) {
    const vista = <View>args.object;

    // 1. Animación de feedback visual (cambia de color y regresa)
    await vista.animate({
        backgroundColor: new Color("#C5CAE9"),
        duration: 300
    });
    await vista.animate({
        backgroundColor: new Color("transparent"),
        duration: 300
    });

    // 2. Diálogo de opciones nativo
    const respuesta = await action({
        title: "Opciones del Libro",
        message: `¿Qué deseas hacer con "${libro.titulo}"?`,
        cancelButtonText: "Cancelar",
        actions: ["Archivar", "Borrar"]
    });

    // 3. Ejecución de la lógica
   if (respuesta === "Borrar") {
        // Actualizamos la variable de estado local filtrando el libro eliminado
        this.librosList = this.librosList.filter(item => item.id !== libro.id);
    } else if (respuesta === "Archivar") {
        this.librosService.archivar(libro); // Se guarda en el arreglo de archivados del servicio
        // Actualizamos la vista localmente removiendo el libro archivado
        this.librosList = this.librosList.filter(item => item.id !== libro.id);
    }
  }
}