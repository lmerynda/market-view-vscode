import * as esbuild from 'esbuild';

const production = process.argv.includes('--production');

await esbuild.build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  external: ['vscode'],
  outfile: 'dist/web/extension.js',
  sourcemap: !production,
  minify: production,
  sourcesContent: false,
  logLevel: 'info'
});
