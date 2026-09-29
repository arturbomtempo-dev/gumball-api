import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        root: './',
        include: ['src/**/*.spec.ts'],
        coverage: {
            include: ['src/**/*.ts'],
            exclude: ['src/generated/**', 'src/main.ts', 'src/**/*.spec.ts'],
        },
    },
});
