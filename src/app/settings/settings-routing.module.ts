import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { SettingsComponent } from './settings.component'
import { EditUserComponent } from './edit/edit-user.component'

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent
  },
  {
    path: 'edit',
    component: EditUserComponent
  }
]

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class SettingsRoutingModule {}