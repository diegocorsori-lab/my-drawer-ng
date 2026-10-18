import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { ConfiguracionService } from '../../services/configuracion.service';
import { alert } from '@nativescript/core/ui/dialogs';

@Component({
  selector: 'EditUser',
  templateUrl: './edit-user.component.html'
  // Ya no necesitamos styleUrls
})
export class EditUserComponent implements OnInit {
  nombreUsuario: string = '';
  errorMessage: string = '';
  isValid: boolean = false;
  isTouched: boolean = false;

  constructor(
    private configuracionService: ConfiguracionService,
    private routerExtensions: RouterExtensions
  ) {}

  ngOnInit(): void {
    const currentUser = this.configuracionService.obtenerNombreUsuario();
    if (currentUser && currentUser !== 'No configurado') {
      this.nombreUsuario = currentUser;
      this.validar();
    }
  }

  onTextChange(args: any): void {
    this.nombreUsuario = args.object.text;
    this.isTouched = true;
    this.validar();
  }

  validar(): boolean {
    this.errorMessage = '';
    
    if (!this.nombreUsuario || this.nombreUsuario.trim().length === 0) {
      this.errorMessage = 'El nombre de usuario es requerido';
      this.isValid = false;
      return false;
    }
    
    if (this.nombreUsuario.trim().length < 3) {
      this.errorMessage = 'El nombre debe tener al menos 3 caracteres';
      this.isValid = false;
      return false;
    }
    
    if (this.nombreUsuario.trim().length > 20) {
      this.errorMessage = 'El nombre no debe exceder 20 caracteres';
      this.isValid = false;
      return false;
    }
    
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9_\s]*$/;
    if (!regex.test(this.nombreUsuario.trim())) {
      this.errorMessage = 'Caracteres no permitidos. Usa solo letras, números y espacios';
      this.isValid = false;
      return false;
    }
    
    this.isValid = true;
    return true;
  }

  guardar(): void {
    this.isTouched = true;
    
    if (this.validar()) {
      try {
        this.configuracionService.guardarNombreUsuario(this.nombreUsuario.trim());
        
        alert({
          title: "Éxito",
          message: "Nombre de usuario guardado correctamente",
          okButtonText: "OK"
        }).then(() => {
          this.routerExtensions.back();
        });
      } catch (error) {
        console.error('Error al guardar:', error);
        this.errorMessage = 'Error al guardar el nombre de usuario';
      }
    }
  }

  cancelar(): void {
    this.routerExtensions.back();
  }

  onBackButtonTap(): void {
    this.routerExtensions.back();
  }
}