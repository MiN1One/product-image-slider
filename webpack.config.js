const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/js/index.js',
  output: {
    publicPath: '/',
    path: path.join(__dirname, './dist'),
    environment: {
      arrowFunction: false,
      bigIntLiteral: false,
      const: false,
      destructuring: false,
      dynamicImport: false,
      forOf: false,
      module: false
    },
    filename: 'product-image-slider.min.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify('production')
    })
  ]
}