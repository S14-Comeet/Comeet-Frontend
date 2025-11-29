import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite'

import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
    ],
    server: {
        port: 5173,
        open: true
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});

