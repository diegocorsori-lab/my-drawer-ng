const path = require('path');
const webpackTestConfig = require('./webpack.test.config.js');

module.exports = function (config) {
  const options = {
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      // Se carga primero para habilitar el compilador JIT de Angular (lo necesita @ngrx/store)
      { pattern: 'src/test-setup-karma.ts', watched: false },
      // Solo el spec del store: webpack sigue automáticamente sus imports
      // (favoritos.reducer.ts, favoritos.actions.ts, @ngrx/store).
      { pattern: 'src/app/store/favoritos.reducer.spec.ts', watched: false }
    ],
    exclude: [],
    preprocessors: {
      'src/test-setup-karma.ts': ['webpack'],
      'src/app/store/favoritos.reducer.spec.ts': ['webpack']
    },

    webpack: webpackTestConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },

    // Declaración explícita de plugins
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-webpack'),
      require('karma-junit-reporter')
    ],

    reporters: ['progress', 'junit'],

    junitReporter: {
      outputDir: __dirname, // Raíz absoluta del proyecto
      outputFile: 'TESTS.XML',
      suite: '',
      useBrowserName: false
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,

    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },

    // Terminar al acabar la prueba para generar el XML
    singleRun: true
  };

  config.set(options);
};