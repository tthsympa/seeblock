const path = require('path')

const merge = require('webpack-merge')
const common = require('./webpack.common.js')

const BUILD_PATH = path.resolve(__dirname, '../build')

module.exports = merge(common, {
  mode: 'production',
})
