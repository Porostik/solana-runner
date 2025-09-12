import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import path from 'path';

export default defineConfig(({}) => ({
  server: {
    port: 3000,
  },

  plugins: [
    tanstackStart({
      target: 'vercel',
      customViteReactPlugin: true,
    }),
  ],

  resolve: {
    alias: {
      'jayson/lib/client/browser': 'jayson/lib/client/browser/index.js',
      'jayson/lib/client': 'jayson/lib/client/index.js',
      '@rotes': path.resolve(__dirname, './src/pages'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@server-functions': path.resolve(__dirname, './src/server-functions'),
      '@middlewares': path.resolve(__dirname, './src/middlewares'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  ssr: {
    noExternal: [/^jayson(\/.*)?$/],
    external: ['uuid'],
    target: 'node',
  },
  optimizeDeps: { exclude: ['jayson'] },
}));
