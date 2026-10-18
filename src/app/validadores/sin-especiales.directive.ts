import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appSinEspeciales]', 
  providers: [{ 
      provide: NG_VALIDATORS, 
      useExisting: forwardRef(() => SinEspecialesDirective), 
      multi: true 
  }]
})
export class SinEspecialesDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) { return null; }
    
    // Validamos que solo tenga letras, números y espacios
    const valido = /^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]*$/.test(control.value);
    
    console.log("Validando el texto: ", control.value, "¿Es válido?: ", valido);
    // Si no es válido, devolvemos un objeto con el error. Si es válido, null.
    return valido ? null : { 'caracteresEspeciales': true };
  }
}