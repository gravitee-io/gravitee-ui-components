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
        '@babel/plugin-transform-typescript',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
      ],
    };
  }

  return {};
};
