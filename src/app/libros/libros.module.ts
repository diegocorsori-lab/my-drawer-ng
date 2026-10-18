import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { LibrosRoutingModule } from './libros-routing.module';
import { LibrosComponent } from './libros.component';
import { LibroDetalleComponent } from './libro-detalle/libro-detalle.component';

@NgModule({
  imports: [NativeScriptCommonModule, LibrosRoutingModule],
  declarations: [LibrosComponent, LibroDetalleComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class LibrosModule {}