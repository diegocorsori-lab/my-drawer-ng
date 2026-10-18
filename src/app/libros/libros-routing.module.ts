import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { LibrosComponent } from './libros.component';
import { LibroDetalleComponent } from './libro-detalle/libro-detalle.component';

const routes: Routes = [
  { path: '', component: LibrosComponent },
  { path: 'detalle/:id', component: LibroDetalleComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class LibrosRoutingModule {}