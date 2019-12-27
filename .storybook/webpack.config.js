module.exports = async ({config}) => {
  config.performance = {hints: false};
  return config;
};
