import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, ImageSource, ImageAsset, knownFolders, path } from '@nativescript/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import * as SocialShare from '@nativescript/social-share'
import { compose } from '@nativescript/email'
import { requestPermissions, takePicture, isAvailable } from '@nativescript/camera'

@Component({
  selector: 'Home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  
  opiniones: Array<any> = []
  librosLeidos$: Observable<string[]>
  fotoCapturada: ImageAsset | null = null

  constructor(private store: Store<{ favoritos: { leidos: string[] } }>) {
    this.librosLeidos$ = store.select(state => state.favoritos.leidos);
  }

  ngOnInit(): void {
    this.opiniones = [
      { texto: "Un clásico imprescindible. Me encantó leerlo.", upvotes: 12, downvotes: 1 },
      { texto: "La narrativa es buena, pero se siente un poco lento.", upvotes: 5, downvotes: 3 }
    ]   
  }

  // MÉTODO CÁMARA CON COMPARTICIÓN INMEDIATA (CUMPLIENDO RÚBRICA)
  async tomarFoto(): Promise<void> {
    try {
      if (!isAvailable()) {
        console.log("La cámara no está disponible en este dispositivo.");
        return;
      }

      await requestPermissions();

      const options = {
        width: 600,
        height: 600,
        keepAspectRatio: false,
        saveToGallery: false
      };

      // 1. Invocar la promesa para tomar la foto
      const imageAsset: ImageAsset = await takePicture(options);

      // 2. Extraer dimensiones para los logs
      const imageSourceFromFile = await ImageSource.fromAsset(imageAsset);
      console.log(`Tamaño: ${imageSourceFromFile.width}x${imageSourceFromFile.height}`);
      console.log(`keepAspectRatio: ${options.keepAspectRatio}`);
      console.log("Foto guardada!");

      this.fotoCapturada = imageAsset;

      // 3. Acceder a la imagen nativa (imageAsset.nativeImage) y compartirla al resolver la promesa
      if (imageAsset.nativeImage) {
        const imageSourceToShare = new ImageSource();
        imageSourceToShare.setNativeSource(imageAsset.nativeImage);
        
        // Disparar el diálogo nativo para compartir la foto recién tomada
        SocialShare.shareImage(imageSourceToShare);
      }

    } catch (error) {
      console.error("Error o cancelación al tomar la foto:", error);
    }
  }

  enviarCorreoFeedback(): void {
    const appFolder = knownFolders.currentApp();
    const logoPath = path.join(appFolder.path, 'app', 'res', 'icon.png');

    compose({
      subject: "Mail de Prueba",
      body: "Hola mundo! :)",
      to: ["mail@mail.com"],
      cc: [],
      bcc: [],
      attachments: [
        {
          fileName: "arrow1.png",
          path: "base64://iVBORw0KGgoAAAANSUhEUgAAABYAAAAoCAYAAAD6xArmAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAHGlET1QAAAACAAAAAAAAABQAAAAoAAAAFAAAABQAAAB5EsHiAAAAAEVJREFUSA1iYKAimDhxYjwIU9FIBgaQgZMmTfoPwlOmTJGniuHIhlLNxaOGwiNqNEypkwlGk9RokoIUfaM5ijo5Clh9AAAAAElFTkSuQmCC",
          mimeType: "image/png"
        },
        {
          fileName: "icon.png",
          path: logoPath,
          mimeType: "image/png"
        }
      ]
    }).then(
      () => console.log("Enviador de mail cerrado"),
      (err) => console.log("Error: " + err)
    );
  }

  compartirLogoApp(): void {
    const rutaImagen = "~/App_Resources/Android/src/main/res/mipmap-hdpi/ic_launcher.png";
    const imageSource = ImageSource.fromFileSync(rutaImagen);

    if (imageSource) {
      SocialShare.shareImage(imageSource);
    } else {
      console.log("No se pudo cargar la imagen para compartir.");
    }
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  onPullToRefresh(args: any): void {
    const pullRefresh = args.object;

    setTimeout(() => {
      const nuevasOpiniones = [
        "¡Excelente libro! Definitivamente lo volvería a leer.",
        "Los personajes secundarios están muy bien desarrollados.",
        "No era lo que esperaba, pero es entretenido."
      ];
      
      const aleatorio = nuevasOpiniones[Math.floor(Math.random() * nuevasOpiniones.length)];

      this.opiniones = [
        { texto: aleatorio, upvotes: 0, downvotes: 0 }, 
        ...this.opiniones
      ];

      pullRefresh.refreshing = false;
    }, 1000);
  }

  onUpvote(opinion: any): void {
    opinion.upvotes += 1;
  }

  onDownvote(opinion: any): void {
    opinion.downvotes += 1;
  }

}