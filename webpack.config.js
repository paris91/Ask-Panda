const path = require('path')

module.exports = {
    entry: './Frontend-js/main.js',
    output: {
        filename: 'main-bundled.js',
        path: path.resolve(__dirname, 'Public')
    },
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
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