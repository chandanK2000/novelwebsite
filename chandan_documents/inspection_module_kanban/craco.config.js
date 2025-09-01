module.exports = {
    devServer: {
      allowedHosts: 'all',  // This allows all hosts. You can also specify a specific domain or IP if needed.
    },
    webpack: {
      configure: (webpackConfig, { env, paths }) => {
        // Custom webpack configuration can go here.
        return webpackConfig;
      },
    },
  };
  