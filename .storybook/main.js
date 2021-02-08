const path = require('path');
const { merge } = require('webpack-merge');

const maxAssetSize = 1024 * 1024;

module.exports = {
  stories: ['../stories/**/*.stories.@(js|mdx)'],

  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],

  webpackFinal: async (config) => {
    return merge(config, {
      module: {
        rules: [
          {
            test: /\.adoc/,
            use: ['asciidoc-loader'],
            include: path.resolve(__dirname, '../'),
          },
          {
            test: /\.html$/i,
            loader: 'ignore-loader',
            include: /node_modules\/codemirror/,
          },
        ],
      },
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30 * 1024,
          maxSize: maxAssetSize,
          cacheGroups: {
            commons: {
              test: /[\\/]node_modules[\\/]/,
              // cacheGroupKey here is `commons` as the key of the cacheGroup
              name(module, chunks, cacheGroupKey) {
                const moduleFileName = module
                  .identifier()
                  .split('/')
                  .reduceRight((item) => item);
                const allChunksNames = chunks.map((item) => item.name).join('~');
                return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
              },
              chunks: 'all',
            },
            components: {
              test: /[\\/]src[\\/]/,
              // cacheGroupKey here is `components` as the key of the cacheGroup
              name(module, chunks, cacheGroupKey) {
                const moduleFileName = module
                  .identifier()
                  .split('/')
                  .reduceRight((item) => item);
                const allChunksNames = chunks.map((item) => item.name).join('~');
                return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
              },
              chunks: 'all',
            },
          },
        },
      },
      performance: {
        maxAssetSize: maxAssetSize,
      },
    });
  },
};
