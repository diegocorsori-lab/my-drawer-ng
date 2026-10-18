import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'

import { NativeScriptModule, registerElement } from '@nativescript/angular'
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular'

import { PullToRefresh } from '@nativescript-community/ui-pulltorefresh'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SearchComponent } from './search/search.component'
import { MapaComponent } from './mapa/mapa.component' // <-- Importación del componente del mapa
import { NativeScriptFormsModule } from '@nativescript/angular'
import { NativeScriptHttpClientModule } from "@nativescript/angular";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { StoreModule } from '@ngrx/store';
import { favoritosReducer } from './store/favoritos.reducer';

registerElement('PullToRefresh', () => PullToRefresh)

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule, 
    NativeScriptModule, 
    NativeScriptUISideDrawerModule,
    NativeScriptFormsModule,
    NativeScriptHttpClientModule, 
    NativeScriptRouterModule,
    
    StoreModule.forRoot({ favoritos: favoritosReducer })
  ],
  declarations: [AppComponent,MapaComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}