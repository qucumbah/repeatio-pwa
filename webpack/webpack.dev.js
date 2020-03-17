const merge = require('webpack-merge');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  devServer: {
    quiet: true,
    publicPath: '/',
    contentBase: './dist',
    hot: true,
    inline: true,
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
  ],
});
