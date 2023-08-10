/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import router from '../router'
import LoadingPlugin from 'vue-loading-overlay';

export function registerPlugins (app) {
  loadFonts();
  app
    .use(LoadingPlugin)
    .use(vuetify)
    .use(router)
}
