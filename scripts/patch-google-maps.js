/**
 * patch-google-maps.js
 *
 * nativescript-google-maps-sdk trae un include.gradle viejo que usa el
 * metodo `compile(...)`, el cual fue eliminado en las versiones modernas
 * del Android Gradle Plugin (usa `implementation(...)` en su lugar).
 * Esto rompe el build de Android con el error:
 *
 *   Could not find method compile() for arguments [...]
 *
 * Este script corrige ese archivo automaticamente despues de cada
 * `npm install`, para no tener que editarlo a mano cada vez que se
 * reinstalan las dependencias.
 */

const fs = require('fs');
const path = require('path');

const gradleFile = path.join(
  __dirname,
  '..',
  'node_modules',
  'nativescript-google-maps-sdk',
  'platforms',
  'android',
  'include.gradle'
);

if (!fs.existsSync(gradleFile)) {
  console.log(
    '[patch-google-maps] No se encontro include.gradle, se omite el parche (esta instalado nativescript-google-maps-sdk?).'
  );
  process.exit(0);
}

let content = fs.readFileSync(gradleFile, 'utf8');

if (content.includes('implementation "com.google.android.gms:play-services-maps')) {
  console.log('[patch-google-maps] El archivo ya estaba parchado, no se hace nada.');
  process.exit(0);
}

const before = 'compile "com.google.android.gms:play-services-maps:$googlePlayServicesVersion"';
const after = 'implementation "com.google.android.gms:play-services-maps:$googlePlayServicesVersion"';

if (!content.includes(before)) {
  console.warn(
    '[patch-google-maps] No se encontro el texto esperado en include.gradle. ' +
      'Puede que el plugin haya cambiado de version; revisa el archivo manualmente:\n' +
      gradleFile
  );
  process.exit(0);
}

content = content.replace(before, after);
fs.writeFileSync(gradleFile, content, 'utf8');

console.log('[patch-google-maps] include.gradle parchado correctamente (compile -> implementation).');
