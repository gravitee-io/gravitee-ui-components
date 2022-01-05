module.exports = {
  features: {
    previewCsfV3: true,
  },
  stories: ['../stories/**/*.stories.@(js|ts|mdx)', '../src/**/*.stories.@(js|ts|mdx)'],

  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],

  babel: async (options) => {
    options.plugins = options.plugins.map((plugin) => {
      if (Array.isArray(plugin) && plugin[0].includes('plugin-proposal-decorators')) {
        plugin[1] = { decoratorsBeforeExport: true };
      }
      return plugin;
    });
    return options;
  },
};
