const path = require('path')
const WebpackBar = require('webpackbar')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const pageName = "visibleShPage"
module.exports = {
  mode: "development",
  entry: `./${pageName}/app.js`,
  output: {
    filename: "build.js",
    path: path.join(__dirname, "./dist")
  },
  devtool: "source-map",
  module: "commonjs",
  devServer: {
    port: 8888,
    open: false,
    compress: false,
    contentBase: path.join(__dirname,"./")
  },
  plugins: [
    new WebpackBar(),
    new HtmlWebpackPlugin({
      title: "hello",
      filename: "index.html",
      template: `./${pageName}/index.html`,
      inject: true
    })
  ],
  module: {
    rules: []
  }
}
