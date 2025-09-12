import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';

export default defineConfig({
  server: {
    port: 3000,
  },

  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      target: 'netlify',
      customViteReactPlugin: true,
      spa: { enabled: true },
    }),
  ],

  resolve: {
    alias: {
      'jayson/lib/client/browser': 'jayson/lib/client/browser/index.js',
      'jayson/lib/client': 'jayson/lib/client/index.js',
    },
  },
  ssr: {
    noExternal: ['jayson'],
  },
});
