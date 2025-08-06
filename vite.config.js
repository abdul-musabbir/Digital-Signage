import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import { run } from 'vite-plugin-run';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [
            laravel({
                input: 'resources/js/app.tsx',
                refresh: true,
            }),
            react(),
            run([
                {
                    name: 'wayfinder',
                    run: ['php', 'artisan', 'wayfinder:generate', '--path=resources/js/lib/wayfinder'],
                    pattern: ['routes/**/*.php', 'app/Domains/**/routes.php'],
                },
            ]),
            checker({
                typescript: true,
            }),
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, './resources/js'),
                '@wayfinder': resolve(__dirname, './resources/js/lib/wayfinder'),
            },
        },
    };
});
