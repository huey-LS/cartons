const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'index': [
      'webpack-dev-server/client?http://localhost:5000/',
      path.resolve(__dirname, './src/index')
    ]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.css']
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    hot: true,
    host: 'localhost:5000',
    inline: true
  },
  mode: process.env.NODE_ENV,
  devtool: 'cheap-module-eval-source-map',
  watch: process.env.NODE_ENV === 'development',
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, './src')
        ],
        exclude: [
          path.resolve(__dirname, './dist')
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html')
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}
