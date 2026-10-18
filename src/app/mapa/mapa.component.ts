import { Component } from "@angular/core";
import { MapView, Marker, Position } from "nativescript-google-maps-sdk";

@Component({
    selector: "app-mapa",
    templateUrl: "./mapa.component.html"
})
export class MapaComponent {
    
    // Equivalente a la function onMapReady(args) de image_33c448.png
    onMapReady(args: any) {
        // var mapView = args.object;
        const mapView: MapView = args.object;
        
        // var marker = new gmaps.Marker();
        const marker = new Marker();
        
        // marker.position = gmaps.Position.positionFromLatLng(...);
        // Coordenadas aproximadas para San Miguel Tehuisco, Tlalpan
        marker.position = Position.positionFromLatLng(19.2618, -99.1950); 
        
        // marker.title = ...
        marker.title = "San Miguel Tehuisco";
        marker.snippet = "Tlalpan, CDMX";
        marker.userData = { index: 1 };
        
        // mapView.addMarker(marker);
        mapView.addMarker(marker);
    }
}