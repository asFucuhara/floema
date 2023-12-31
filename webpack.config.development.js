const path = require('path')

const { merge } = require('webpack-merge')

const config = require('./webpack.config')
const webpack = require('webpack')

module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    devMiddleware: {
      writeToDisk: true
    }
  },
  output: {
    path: path.resolve(__dirname, 'public')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})
