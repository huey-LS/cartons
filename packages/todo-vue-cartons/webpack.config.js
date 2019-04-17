const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: {
    'index': [
      path.resolve(__dirname, './src/index')
    ]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.less', '.css']
  },
  externals: {
    'vue': 'Vue',
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    hot: true,
    port: 5000,
    inline: true
  },
  mode: process.env.NODE_ENV,
  devtool: 'eval-source-map',
  watch: process.env.NODE_ENV === 'development',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(css)$/,
        use: [
          'vue-style-loader',
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(js)$/,
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
    new webpack.ProvidePlugin({
      'vue': 'vue'
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html')
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}
