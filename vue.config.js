const webpack = require("webpack");
module.exports = {
  devServer: {
    disableHostCheck: true,
    port: 80,
    proxy: {
      '/api': {
        target: `https://cs1.nnzbzh.cn/`,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
  },
  publicPath: "./",
  chainWebpack(config) {
    config
      .plugin("context")
      .use(webpack.ContextReplacementPlugin, [/moment[/\\]locale$/, /zh-cn/]);
  }
};
