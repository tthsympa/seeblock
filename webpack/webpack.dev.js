const path = require('path')

const merge = require('webpack-merge')
const common = require('./webpack.common.js')

const PUBLIC_PATH = path.resolve(__dirname, '../public')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: PUBLIC_PATH,
    historyApiFallback: true,
  },
})
