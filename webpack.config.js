const path = require('path')
const HTMLWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  mode: "development",

  entry: {
    main: './example/index.tsx',
  },

  output: {
    path: path.resolve(__dirname, './example-dist'),
    publicPath: '/',
    filename: 'js/[name].js'
  },

  module: {
    rules: [{
      test: /\.[jt]sx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      }
    }],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  plugins: [
    new HTMLWebpackPlugin({ template: './example/index.html' }),
  ],

  devtool: 'eval-source-map',

  devServer: {
    historyApiFallback: true,
    open: true,
    port: 8000,
    stats: 'errors-only',
  },
}
