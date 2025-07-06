module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add a rule to disable fullySpecified for .js and .mjs files
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });
      return webpackConfig;
    },
  },
};