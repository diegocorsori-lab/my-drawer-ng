import { createAction, props } from '@ngrx/store';

export const leerAhora = createAction(
  '[Favoritos] Leer Ahora',
  props<{ titulo: string }>()
);

export const agregarLeido = createAction(
  '[Favoritos] Agregar Leido',
  props<{ titulo: string }>()
);

export const removerLeido = createAction(
  '[Favoritos] Remover Leido',
  props<{ titulo: string }>()
);