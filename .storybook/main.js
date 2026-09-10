// `gv-chart-map` loads its geography from `@highcharts/map-collection` through a dynamic import, a
// form Vite cannot expand because the prefix is a bare package specifier. `import.meta.glob` gives
// the same result for the Storybook build; consumer bundlers keep resolving the published source as
// is. The plugin fails loudly rather than let the map stories render empty.
const MAP_COLLECTION_GLOB = '/node_modules/@highcharts/map-collection/**/*.geo.json';
const MAP_COLLECTION_IMPORT = /^(\s*)(.*)await import\((.*@highcharts\/map-collection.*)\);$/;
const highchartsMapCollection = {
  name: 'gravitee-highcharts-map-collection',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('gv-chart-map.js')) {
      return null;
    }
    let rewritten = 0;
    const lines = code.split('\n').map((line) => {
      const match = line.match(MAP_COLLECTION_IMPORT);
      if (match == null) {
        return line;
      }
      rewritten += 1;
      const [, indent, before, specifier] = match;
      const key = specifier.replace('@highcharts/map-collection/', '/node_modules/@highcharts/map-collection/');
      return `${indent}${before}await mapCollection[${key}]();`;
    });
    if (rewritten === 0) {
      throw new Error('gv-chart-map no longer imports @highcharts/map-collection: drop this plugin.');
    }
    return { code: [`const mapCollection = import.meta.glob('${MAP_COLLECTION_GLOB}');`, ...lines].join('\n'), map: null };
  },
};

module.exports = {
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|ts)', '../src/**/*.mdx', '../src/**/*.stories.@(js|ts)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  staticDirs: ['../assets'],
  viteFinal: async (config) => {
    config.plugins.push(highchartsMapCollection);
    return config;
  },
};
