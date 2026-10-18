import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  
  private readonly NOMBRE_USUARIO_KEY = 'nombreUsuario';
  private storage = new Map<string, string>();

  constructor() { }

  guardarNombreUsuario(nombre: string): void {
    // Intentar usar ApplicationSettings si está disponible
    try {
      const appSettings = require('@nativescript/core/application-settings');
      appSettings.setString(this.NOMBRE_USUARIO_KEY, nombre);
    } catch (error) {
      // Fallback a almacenamiento en memoria
      this.storage.set(this.NOMBRE_USUARIO_KEY, nombre);
      console.log('Usando almacenamiento en memoria como fallback');
    }
  }

  obtenerNombreUsuario(): string {
    try {
      const appSettings = require('@nativescript/core/application-settings');
      return appSettings.getString(this.NOMBRE_USUARIO_KEY, 'No configurado');
    } catch (error) {
      // Fallback a almacenamiento en memoria
      return this.storage.get(this.NOMBRE_USUARIO_KEY) || 'No configurado';
    }
  }

  tieneNombreUsuario(): boolean {
    try {
      const appSettings = require('@nativescript/core/application-settings');
      return appSettings.hasKey(this.NOMBRE_USUARIO_KEY);
    } catch (error) {
      return this.storage.has(this.NOMBRE_USUARIO_KEY);
    }
  }

  eliminarNombreUsuario(): void {
    try {
      const appSettings = require('@nativescript/core/application-settings');
      appSettings.remove(this.NOMBRE_USUARIO_KEY);
    } catch (error) {
      this.storage.delete(this.NOMBRE_USUARIO_KEY);
    }
  }
}
