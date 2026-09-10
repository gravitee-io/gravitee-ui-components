module.exports = (api) => {
  const isTest = api.env('test');
  // You can use isTest to determine what presets and plugins to use.

  if (isTest) {
    return {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
          },
          '@babel/preset-typescript',
        ],
      ],
      plugins: [
        // Jest runs `@asciidoctor/core` through Babel, and its browser bundle uses `import.meta`.
        'babel-plugin-transform-import-meta',
        '@babel/plugin-transform-typescript',
        ['@babel/plugin-proposal-decorators', { version: 'legacy' }],
        ['@babel/plugin-transform-class-properties', { loose: true }],
        ['@babel/plugin-transform-private-property-in-object', { loose: true }],
        ['@babel/plugin-transform-private-methods', { loose: true }],
      ],
    };
  }

  return {};
};
