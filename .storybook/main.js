module.exports = {
  features: {
    previewCsfV3: true,
  },
  stories: ['../stories/**/*.stories.@(js|ts|mdx)', '../src/**/*.stories.@(js|ts|mdx)'],

  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
};
