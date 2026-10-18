import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application } from '@nativescript/core'
import { RouterExtensions } from '@nativescript/angular'
import { ConfiguracionService } from '../services/configuracion.service'

@Component({
  selector: 'Settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  nombreUsuario: string = 'No configurado'

  constructor(
    private configuracionService: ConfiguracionService,
    private routerExtensions: RouterExtensions
  ) {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    this.cargarNombreUsuario()
  }

  cargarNombreUsuario(): void {
    this.nombreUsuario = this.configuracionService.obtenerNombreUsuario()
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  irAEditar(): void {
    this.routerExtensions.navigate(['/settings/edit'])
  }
}