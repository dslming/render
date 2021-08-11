const path = require('path')
const WebpackBar = require('webpackbar')
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
  mode: "development",
  entry: "./app.js",
  output: {
    filename: "build.js",
    path: path.join(__dirname, "./dist")
  },
  devtool: "source-map",
  devServer: {
    port: 8888,
    open: false,
    compress: false,
    contentBase: path.join(__dirname,"./public/")
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, "./src/")
    }
  },
  plugins: [
    new WebpackBar(),
    new HtmlWebpackPlugin({
      title: "hello",
      filename: "index.html",
      template: "./public/index.html",
      inject: true
    })
  ],
  module: {
    rules: [
      {

      }
    ]
  }
}
