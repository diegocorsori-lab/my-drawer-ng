import { createReducer, on } from '@ngrx/store';
import * as FavoritosActions from './favoritos.actions';

export interface FavoritosState {
  leidos: string[];
}

export const initialState: FavoritosState = {
  leidos: []
};

export const favoritosReducer = createReducer(
  initialState,
  on(FavoritosActions.leerAhora, (state, { titulo }) => {
    // Si ya existe el título en el array, no lo duplicamos
    if (state.leidos.includes(titulo)) {
      return state;
    }
    // Si no existe, lo agregamos al state
    return {
      ...state,
      leidos: [...state.leidos, titulo]
    };
  }),
  on(FavoritosActions.agregarLeido, (state, { titulo }) => {
    // Si ya existe el título en el array, no lo duplicamos
    if (state.leidos.includes(titulo)) {
      return state;
    }
    return {
      ...state,
      leidos: [...state.leidos, titulo]
    };
  }),
  on(FavoritosActions.removerLeido, (state, { titulo }) => {
    return {
      ...state,
      leidos: state.leidos.filter((libro) => libro !== titulo)
    };
  })
);