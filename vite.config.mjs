import vue from "@vitejs/plugin-vue";
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [vue(), tailwindcss()],
    server: {
        middlewareMode: true,
    },
    build: {
        outDir: '../dist/client',
        emptyOutDir: true,
    },
    root: 'webapp',
})