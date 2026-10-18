import { Injectable, Injector } from '@angular/core'; // <-- 1. Importamos Injector
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as sqlite from 'nativescript-sqlite';

export interface Libro {
    id: number;
    titulo: string;
    autor: string;
    imagen: string;
}

@Injectable({
    providedIn: 'root'
})
export class LibrosService {

    private apiUrl = 'https://gratitude-hatless-regroup.ngrok-free.dev';
    private libros: Libro[] = [
        { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", imagen: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150"},
        { id: 2, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes",imagen: "~/images/quijote.png" },
        { id: 3, titulo: "El Aleph", autor: "Jorge Luis Borges", imagen: "res://icon"}
    ];    
    private librosArchivados: Libro[] = [];
    
    // 2. Quitamos HttpClient del constructor e inyectamos Injector
    constructor(private injector: Injector) {}

getDb(fnOk: (db: any) => void, fnError: (err: any) => void) {
        return new (sqlite as any)("mi_db_logs", (err: any, db: any) => {
            if (err) {
                console.error("Error al abrir db!", err);
                fnError(err);
            } else {
                console.log("Está la db abierta: ", db.isOpen() ? "Si" : "No");
                db.execSQL("CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, texto TEXT)")
                    .then((id: any) => {
                        console.log("CREATE TABLE OK");
                        fnOk(db);
                    }, (error: any) => {
                        console.log("CREATE TABLE ERROR", error);
                        fnError(error);
                    });
            }
        });
    }

    guardarFavorito(tituloLibro: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.getDb((db) => {
                db.execSQL("CREATE TABLE IF NOT EXISTS favoritos (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT)")
                    .then(() => {
                        return db.execSQL("INSERT INTO favoritos (titulo) VALUES (?)", [tituloLibro]);
                    })
                    .then(() => {
                        console.log("Favorito guardado en SQLite:", tituloLibro);
                        resolve();
                    }, (error: any) => {
                        console.error("Error al insertar favorito:", error);
                        reject(error);
                    });
            }, (err) => {
                reject(err);
            });
        });
    }

    obtenerFavoritosDB(): Promise<Libro[]> {
        return new Promise((resolve, reject) => {
            this.getDb((db) => {
                db.execSQL("CREATE TABLE IF NOT EXISTS favoritos (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT)")
                    .then(() => {
                        return db.all("SELECT id, titulo FROM favoritos", []);
                    })
                    .then((rows: any[]) => {
                        const favoritos: Libro[] = rows.map(row => ({
                            id: row[0],
                            titulo: row[1],
                            autor: 'Favorito guardado',
                            imagen: 'res://icon'
                        }));
                        resolve(favoritos);
                    }, (error: any) => {
                        console.error("Error al consultar favoritos:", error);
                        reject(error);
                    });
            }, (err) => {
                reject(err);
            });
        });
    }

    buscar(query: string = ''): Observable<Libro[]> {
        // 3. Obtenemos la instancia de HttpClient SOLAMENTE cuando se llama a esta función
        const http = this.injector.get(HttpClient);

        return http.get<string[]>(`${this.apiUrl}/get?q=${query}`).pipe(
            map((titulos: string[]) => {
                // Transformamos el arreglo de strings en un arreglo de objetos Libro
                return titulos.map((tituloBackend, index) => ({
                    id: index + 1,
                    titulo: tituloBackend,
                    autor: 'Autor Desconocido', // Dato temporal
                    imagen: 'res://icon'        // Dato temporal
                }));
            })
        );
    }

    // Funciones locales para manejo de archivados
    archivar(libroSeleccionado: Libro): void {
        this.librosArchivados.push(libroSeleccionado);
    }
    
    obtenerArchivados(): Libro[] {
        return this.librosArchivados;
    }
}