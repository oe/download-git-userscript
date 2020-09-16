const path = require('path')
const WebpackUserscript = require('webpack-userscript')
const pkg = require('./package.json')

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `${pkg.name}.js`
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env']
            ]
          }
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new WebpackUserscript({
      headers ({ name, version }) {
        return {
          name,
          version: version + '.alpha',
          author: 'Saiya',
          description: 'download github directory via one click',
          match: 'http://www.gov.cn/*',
          grant: [
            'GM_setValue',
            'GM_getValue'
          ]
        }
      },
      pretty: false
    })
  ]
}
