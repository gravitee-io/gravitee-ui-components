module.exports = {
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|ts)', '../src/**/*.mdx', '../src/**/*.stories.@(js|ts)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  staticDirs: ['../assets'],
};
