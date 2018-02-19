const path = require('path');

const parentDir = path.join(__dirname, '../');

module.exports = {
  entry: [
    'babel-polyfill',
    path.join(parentDir, 'index.js'),
  ],
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]',
    }, {
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {},
        },
      ],
    }],
  },
  output: {
    path: `${parentDir} + /dist`,
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: parentDir,
    historyApiFallback: true,
  },
};
