const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    publicPath: '/',
    path: path.join(__dirname, './dist'),
    filename: 'product-image-slider.min.js'
  },
  devServer: {
    contentBase: './dist',
    overlay: true
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
  }
}