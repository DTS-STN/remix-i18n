/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  cacheDirectory: './node_modules/.cache/remix',
  serverModuleFormat: 'esm',
  serverPlatform: 'node',
  tailwind: true,
  watchPaths: ['./tailwind.config.ts'],
};
