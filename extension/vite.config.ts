import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'popup.html'),
        content: resolve(__dirname, './src/content.js'),
        background: resolve(__dirname, './src/background.js'),
      },
      output: {
        entryFileNames: `assets/[name].js`,
      },
      plugins: [
        AutoImport({
          imports: [
            {
              'webextension-polyfill': [['*', 'browser']],
            },
          ],
        }),
      ],
    },
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['webextension-polyfill'],
  },
  resolve: {
    alias: {
      '@src': resolve(__dirname, './src'),
    },
    extensions: ['.ts', '.tsx', '.js'],
  },
  css: {
    preprocessorOptions: {
      css: {
        modules: {
          generateScopedName: '[name]__[local]__[hash:base64:5]',
          localIdentName: '[name]__[local]__[hash:base64:5]',
          scopeBehaviour: 'local',
        },
      },
    },
  },
});
