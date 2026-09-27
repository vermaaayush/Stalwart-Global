import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        capabilities: resolve(import.meta.dirname, 'capabilities.html'),
        stalwartGlobal: resolve(import.meta.dirname, 'stalwart-global.html'),
        indianTadka: resolve(import.meta.dirname, 'indian-tadka.html'),
        stalwartResources: resolve(import.meta.dirname, 'stalwart-resources.html'),
        stalwartLifeSciences: resolve(import.meta.dirname, 'stalwart-life-sciences.html'),
        globalPresence: resolve(import.meta.dirname, 'global-presence.html'),
        partner: resolve(import.meta.dirname, 'partner.html'),
        contact: resolve(import.meta.dirname, 'contact.html'),
      },
    },
  },
});
