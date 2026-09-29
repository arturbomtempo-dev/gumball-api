import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        root: './',
        include: ['**/*.e2e-spec.ts'],
        env: {
            NODE_ENV: 'test',
            LOG_LEVEL: 'silent',
            DATABASE_URL: 'postgresql://user:password@localhost:5432/gumball',
        },
    },
});
