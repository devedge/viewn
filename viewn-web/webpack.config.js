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
    // Outputs are: (both under /dist/)
    // global.bundle.js
    // video.bundle.js
  },
  module: {
    rules: [
      { // run for css files
        test: /\.css$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader"   // translates CSS into CommonJS
        }]
      }, { // run for scss files
        test: /\.scss$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader"   // translates CSS into CommonJS
        }, {
          loader: "sass-loader"  // compiles Sass to CSS
        }]
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
