import * as FavoritosActions from './favoritos.actions';
import { favoritosReducer, initialState, FavoritosState } from './favoritos.reducer';

describe('Suite de Pruebas Unitarias con Jasmine: Redux Favoritos', () => {
  let stateInicialPrueba: FavoritosState;

  // Setup de Jasmine antes de cada spec
  beforeEach(() => {
    stateInicialPrueba = {
      leidos: ['El Aleph', 'Rayuela']
    };
  });

  // Spec 1: Estado por defecto
  it('debe retornar el estado inicial cuando la acción no está registrada', () => {
    const action = { type: '[Unknown] Action Test' } as any;
    const result = favoritosReducer(undefined, action);

    expect(result).toBeDefined();
    expect(result).toEqual(initialState);
  });

  // Spec 2: Agregar elementos (Action + Reducer con 'titulo')
  it('debe agregar un nuevo libro a la lista de leídos mediante agregarLeido', () => {
    const nuevoLibro = 'Cien años de soledad';
    const action = FavoritosActions.agregarLeido({ titulo: nuevoLibro });

    const result = favoritosReducer(stateInicialPrueba, action);

    expect(result.leidos.length).toBe(3);
    expect(result.leidos).toContain(nuevoLibro);
    expect(result.leidos[2]).toEqual(nuevoLibro);
  });

  // Spec 3: Remover elementos (Action + Reducer con 'titulo')
  it('debe eliminar un libro de la lista mediante removerLeido', () => {
    const libroAEliminar = 'Rayuela';
    const action = FavoritosActions.removerLeido({ titulo: libroAEliminar });

    const result = favoritosReducer(stateInicialPrueba, action);

    expect(result.leidos.length).toBe(1);
    expect(result.leidos).not.toContain(libroAEliminar);
    expect(result.leidos).toEqual(['El Aleph']);
  });
});