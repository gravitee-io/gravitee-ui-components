const path = require('path');

module.exports = {
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-notes/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-viewport/register',
  ],
  presets: ['@storybook/addon-docs/preset'],

  webpackFinal: async (config, {configType}) => {
    config.performance = {hints: false};
    config.module.rules.push({
      test: /\.adoc/,
      use: ["asciidoc-loader"],
      include: path.resolve(__dirname, '../'),
    });

    return config;
  },
};


