import { Component, EventEmitter, Output } from "@angular/core";
import { Toasty } from 'nativescript-toasty';


@Component({
    selector: "SearchForm",
    moduleId: module.id,
    template: `
    <StackLayout margin="10 20">
        <!-- Agregamos un hint y un borde inferior para que el campo de texto sea visible y puedas tocarlo -->
        <TextField [(ngModel)]="textFieldValue" hint="Buscar..." style="border-bottom-width: 1; border-bottom-color: #3F51B5; font-size: 16; padding-bottom: 5; margin-bottom: 10;"></TextField>
        <Button text="BUSCAR!" (tap)="onButtonTap()" backgroundColor="#E0E0E0" color="#333333" height="45"></Button>
    </StackLayout>
    `
})
export class SearchFormComponent {
    textFieldValue: string = "";
    @Output() search: EventEmitter<string> = new EventEmitter();

    onButtonTap(): void {
        console.log(this.textFieldValue);
        if (this.textFieldValue.length > 2) {
            this.search.emit(this.textFieldValue);
            
            new Toasty({ text: `Buscando "${this.textFieldValue}"...` }).show();
            
        } else {
            // 3. Mostramos un Toast de advertencia si el texto es muy corto
            new Toasty({ text: "⚠️ Escribe al menos 3 caracteres" }).show();
        }
    }
}