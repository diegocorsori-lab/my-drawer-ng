import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular'

import {LibrosService} from '../services/libros.service';
import {SearchFormComponent } from './search-form.component'
import { SearchRoutingModule } from './search-routing.module'
import { SearchComponent } from './search.component'

import { SinEspecialesDirective } from '../validadores/sin-especiales.directive';
@NgModule({
  imports: [NativeScriptCommonModule, SearchRoutingModule, NativeScriptFormsModule],
  declarations: [SearchComponent, SearchFormComponent, SinEspecialesDirective

  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SearchModule {}
