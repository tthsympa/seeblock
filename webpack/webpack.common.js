const path = require('path')
const webpack = require('webpack')

const parentDir = path.join(__dirname, '../')
const BUILD_PATH = path.resolve(__dirname, '../build')

module.exports = {
  entry: ['babel-polyfill', path.join(parentDir, 'index.js')],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        loader:
          'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV || 'development',
    }),
  ],
  output: {
    path: BUILD_PATH,
    filename: 'bundle.js',
  },
}
