const path = require('path');

module.exports = {
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-docs',
    '@storybook/addon-knobs/register',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport/register',
  ],

  webpackFinal: async (config, {configType}) => {
    config.module.rules.push({
      test: /\.adoc/,
      use: ["asciidoc-loader"],
      include: path.resolve(__dirname, '../'),
    });
    return config;
  },
};
