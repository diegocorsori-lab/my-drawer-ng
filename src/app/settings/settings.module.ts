import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from '@nativescript/angular'

import { SettingsRoutingModule } from './settings-routing.module'
import { SettingsComponent } from './settings.component'
import { EditUserComponent } from './edit/edit-user.component'
import { ConfiguracionService } from '../services/configuracion.service'

@NgModule({
  imports: [NativeScriptCommonModule, SettingsRoutingModule],
  declarations: [
    SettingsComponent,
    EditUserComponent
  ],
  providers: [
    ConfiguracionService
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SettingsModule {}