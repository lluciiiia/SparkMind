import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        app: join(__dirname, 'popup.html'),
        content: join(__dirname, 'src/content.js'),
        background: join(__dirname, 'src/background.js'),
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
      '@src': resolve(__dirname, 'src/'),
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
