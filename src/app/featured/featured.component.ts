import { Component, OnInit } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Application, GestureEventData, GridLayout } from '@nativescript/core';
import { LibrosService, Libro } from '../services/libros.service';
import { Store } from '@ngrx/store'; // 1. Importamos Store de NgRx
import { leerAhora } from '../store/favoritos.actions'; // 2. Importamos la acción de Redux

@Component({
  selector: 'Featured',
  templateUrl: './featured.component.html',
})
export class FeaturedComponent implements OnInit {
  
  favoritosList: Array<Libro> = [];

  // 3. Inyectamos tanto el servicio de libros como el Store de Redux
  constructor(
    private librosService: LibrosService,
    private store: Store<{ favoritos: { leidos: string[] } }>
  ) {}

  ngOnInit(): void {
    this.cargarFavoritos();
  }

  onNavigatedTo(): void {
    this.cargarFavoritos();
  }

  async cargarFavoritos() {
    try {
      this.favoritosList = await this.librosService.obtenerFavoritosDB();
      console.log("Favoritos cargados en Featured desde SQLite:", this.favoritosList);
    } catch (error) {
      console.error("Error al cargar favoritos en Featured:", error);
    }
  }

  // 4. Método que procesa el ícono "Leer" y despacha la acción al state de Redux
  marcarLeerAhora(tituloLibro: string) {
    this.store.dispatch(leerAhora({ titulo: tituloLibro }));
    console.log(`Acción 'LeerAhora' emitida para el libro de la librería: ${tituloLibro}`);
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }

  onLongPress(args: GestureEventData){
    console.log('Object that triggered the event: ' + args.object);
    console.log('View that triggered the event: '+ args.view);
    console.log('Event name: '+ args.eventName);

    const grid = <GridLayout>args.object;
    grid.rotate = 0;
    grid.animate({
      rotate: 360,
      duration: 2000
    });
  }
}