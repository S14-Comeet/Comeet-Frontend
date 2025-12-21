import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite'

import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
    plugins: [
        vue(),
        svgLoader(),
        tailwindcss(),
    ],
    server: {
        port: 5173,
        open: true,
        proxy: {
            '/kakao-api': {
                target: 'https://dapi.kakao.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/kakao-api/, '')
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});

