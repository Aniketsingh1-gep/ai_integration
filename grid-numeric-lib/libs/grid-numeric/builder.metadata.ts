module.exports = {
  dependencies: {
    // TODO: Add dependencies of new plugin e.g. "plugin-injector" | Ensure that plugin-injector dependency is updated.
    '@nexxe/plugin-injector': '0.0.1-alpha.6',
    "@nexxe/core-types": "0.0.1-alpha.43",
    "@nexxe/core": "0.0.1-alpha.38",
    "@nexxe/core-vendors": "0.0.9",
    "@nexxe/grid-core": "^3.0.0-next.39",
    '@nexxe/shared': '0.0.0-next.65',
  },
  config: {
    // Location where the new plugin will be located after running npm run release:plugin
    outDir: 'dist/bin',

    // Location where the new plugin will be distributed to in CDN, Plugin Injector will load plugin from the below directory
    // If new plugin is a platform plugin, path should be 'assets/plugins/packages/platform/plugin-injector'
    loaderDistPath: 'assets/plugins/packages/components/grid-numeric',

    // If new plugin is meant to expose components, components will be accessible through assetKey, by convention it should be lib-name_assets
    moduleAssetsKey: 'grid-numeric_assets',

    // The class name of library main module
    moduleClassName: 'GridNumericModule',

    // The location of the module relative to plugin-builder/nexxe-builder.lib.main.ts
    // If new module relocated from lib folder to another place, please update moduleFilePath to match.
    moduleFilePath: '../dist/build/lib/grid-numeric.module'
  },
  options: {
    hashDigestLength: 4,                // Number of hash chars to be postfixed after module id, only applicable in prod mode.
    buildCacheThreshold: 60,            // Number of seconds to cache the lib source in dist/lib-name/build before fetching fresh copy.
    mergeDistributionPath: true,        // If true, plugin will be placed in a series of directories that match CDN structure.
    versionizedDistributionPath: true,  // If true, builder will merge the plugin path with the dist path so it would be easier to maintain multiple versions in CDN.
    autoDeleteRuntime: true,            // If true, builder will delete the runtime chunk after build.
    autoDeleteSourceMap: false          // If true, builder will delete the source-map of aot build.
  }
};