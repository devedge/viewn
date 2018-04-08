const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: {
    global: './src/javascript/global.js',
    video: './src/javascript/video.js'
  },
  output: {
    path: path.resolve(__dirname, 'static', 'dist'),
    filename: '[name].bundle.js'
    // global.bundle.js
    // video.bundle.js
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin({
      cache: true,
      parallel: true
    })
  ]
};
