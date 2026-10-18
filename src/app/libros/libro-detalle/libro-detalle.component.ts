import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dialogs } from '@nativescript/core';
import { Toasty } from '@triniwiz/nativescript-toasty';

@Component({
  selector: 'ns-libro-detalle',
  template: `
    <ActionBar title="Detalle del Libro"></ActionBar>

    <GridLayout class="page__content">
        <StackLayout width="100%" height="100%">
            <!-- Título que muestra el ID del libro -->
            <Label [text]="'ID del libro seleccionado: ' + libroId" class="h2 text-center m-10"></Label>
            <Label text="Opiniones de Usuarios:" class="h3 m-l-10"></Label>
            
            <PullToRefresh (refresh)="onPullToRefresh($event)">
                <ListView [items]="opiniones" class="list-group" height="100%">
                    <ng-template let-opinion="item" let-i="index">
                        <GridLayout columns="*, auto, auto, auto, auto" rows="auto" class="list-group-item p-10">
                            
                            <!-- Columna 0: Texto de la opinión -->
                            <StackLayout col="0" class="m-r-10">
                                <Label [text]="opinion.texto" textWrap="true"></Label>
                                <Label *ngIf="opinion.categoria" [text]="'Categoría: ' + opinion.categoria" class="text-muted text-sm"></Label>
                            </StackLayout>

                            <!-- Columna 1 y 2: Votos -->
                            <StackLayout col="1" orientation="horizontal" class="m-r-10" (tap)="onUpvote(opinion)">
                                <Label text="👍"></Label>
                                <Label [text]="opinion.upvotes" class="m-l-5"></Label>
                            </StackLayout>
                            <StackLayout col="2" orientation="horizontal" class="m-r-10" (tap)="onDownvote(opinion)">
                                <Label text="👎"></Label>
                                <Label [text]="opinion.downvotes" class="m-l-5"></Label>
                            </StackLayout>

                            <!-- Columna 3: ACTION DIALOG -->
                            <Label col="3" text="🏷️" class="m-r-10 h2" (tap)="onCategorize(opinion)"></Label>

                            <!-- Columna 4: ALERT DE ELIMINACIÓN -->
                            <Label col="4" text="🗑️" class="h2 text-danger" (tap)="onDelete(i)"></Label>

                        </GridLayout>
                    </ng-template>
                </ListView>
            </PullToRefresh>
        </StackLayout>
    </GridLayout>
  `
})
export class LibroDetalleComponent implements OnInit {
  libroId: string = '';
  opiniones: Array<any> = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.libroId = this.route.snapshot.params['id'];
    this.opiniones = [
      { texto: "Un clásico imprescindible. Me encantó leerlo.", upvotes: 12, downvotes: 1, categoria: "Sin categorizar" },
      { texto: "La narrativa es buena, pero se siente un poco lento.", upvotes: 5, downvotes: 3, categoria: "Sin categorizar" }
    ];
  }

  // REQUISITO 1: Alert de eliminación
  async onDelete(index: number) {
    this.opiniones.splice(index, 1);
    this.opiniones = [...this.opiniones]; // Refresca la vista

    await Dialogs.alert({
        title: "Acción completada",
        message: "Se eliminó el elemento correctamente.",
        okButtonText: "Entendido"
    });
  }

  // REQUISITO 2 Y 3: Action Dialog y Toast
  async onCategorize(opinion: any) {
    const resultado = await Dialogs.action({
        message: "Selecciona la categoría para esta opinión:",
        cancelButtonText: "Cancelar",
        actions: ["Excelente Crítica", "Crítica Constructiva", "Queja"]
    });

    if (resultado !== "Cancelar" && resultado !== undefined) {
        opinion.categoria = resultado;

        // CORRECCIÓN: Concatenación segura sin acentos graves
        const toast = new Toasty({
            text: "¡Editado correctamente! Nueva categoría: " + resultado
        });
        toast.show();
    }
  }

  // Lógica de votos
  onUpvote(opinion: any): void {
    opinion.upvotes += 1;
  }

  onDownvote(opinion: any): void {
    opinion.downvotes += 1;
  }

  // Lógica del pull to refresh
  onPullToRefresh(args: any): void {
    const pullRefresh = args.object;
    setTimeout(() => {
      const nuevasOpiniones = [
        "¡Excelente libro! Definitivamente lo volvería a leer.",
        "Los personajes secundarios están muy bien desarrollados."
      ];
      const aleatorio = nuevasOpiniones[Math.floor(Math.random() * nuevasOpiniones.length)];

      this.opiniones = [
        { texto: aleatorio, upvotes: 0, downvotes: 0, categoria: "Sin categorizar" }, 
        ...this.opiniones
      ];
      pullRefresh.refreshing = false;
    }, 1000);
  }
}