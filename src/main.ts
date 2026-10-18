import { platformNativeScript, runNativeScriptAngularApp } from '@nativescript/angular';
import { AppModule } from './app/app.module';
import { registerElement } from '@nativescript/angular';

// --- Importaciones de Firebase ---
import { firebase } from "@nativescript/firebase-core";
import "@nativescript/firebase-messaging";
import { alert } from "@nativescript/core"; 

// --- Importaciones de Google Maps ---
import { MapView } from "nativescript-google-maps-sdk";

// --- Registro de Componentes UI ---
registerElement('PullToRefresh', () => require('@nativescript-community/ui-pulltorefresh').PullToRefresh);
registerElement('MapView', () => MapView);

// --- Inicialización de Firebase (FCM y Notificaciones) ---
firebase().initializeApp().then(() => {
    console.log("Firebase initialized successfully");

    // Obtener el Token asignado para notificaciones
    firebase().messaging().getToken().then((token) => {
        console.log("FCM Device Token: ", token);
    });

    // Escuchar notificaciones entrantes en primer plano con onMessage
    firebase().messaging().onMessage((message: any) => {
        console.log("Notificación recibida: ", message);
        alert({
            title: message.title || "Notificación de Firebase",
            message: message.body || "Tienes un nuevo mensaje entrante",
            okButtonText: "OK"
        });
    });
}).catch((error) => {
    console.error("Error al inicializar Firebase: ", error);
});

// --- Arranque de la Aplicación Angular ---
runNativeScriptAngularApp({
  appModuleBootstrap: () => platformNativeScript().bootstrapModule(AppModule),
});