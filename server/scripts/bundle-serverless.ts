import { readFileSync } from 'node:fs';
import { build, type Plugin } from 'esbuild';

const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as {
    dependencies: Record<string, string>;
};

const bundledPackages = Object.keys(manifest.dependencies).filter(
    (name) => name.startsWith('@nestjs/') || name === 'nestjs-pino'
);

function isBundled(path: string): boolean {
    return bundledPackages.some((name) => path === name || path.startsWith(`${name}/`));
}

const externalizeOtherPackages: Plugin = {
    name: 'externalize-other-packages',
    setup(context) {
        context.onResolve({ filter: /^[^./]/ }, ({ path, kind }) => {
            if (kind === 'entry-point' || isBundled(path)) {
                return undefined;
            }

            return { path, external: true };
        });
    },
};

await build({
    entryPoints: ['dist/serverless.js'],
    outfile: 'dist/serverless.bundle.js',
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node22',
    keepNames: true,
    legalComments: 'none',
    logLevel: 'warning',
    plugins: [externalizeOtherPackages],
    banner: {
        js: "import { createRequire as createBundleRequire } from 'node:module'; const require = createBundleRequire(import.meta.url);",
    },
});
