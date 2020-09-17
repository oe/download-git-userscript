const path = require('path')
const WebpackUserscript = require('webpack-userscript')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const pkg = require('./package.json')

const outputPath = path.resolve(__dirname, 'dist')
const isDev = process.env.NODE_ENV === 'development'
const PORT = 8080
const enableHTTPS = true

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src/index.ts'),
  output: {
    path: outputPath,
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
  devServer: {
    https: enableHTTPS,
    port: PORT,
    writeToDisk: true,
    contentBase: outputPath,
    hot: false,
    inline: false,
    liveReload: false
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackUserscript({
      headers ({ name, version }) {
        return {
          name,
          version: version + '.alpha',
          author: 'Saiya',
          description: 'download github directory via one click',
          match: 'https://github.com/*',
          grant: [],
          noframes: true
        }
      },
      proxyScript: {
        baseUrl: 'file://' + encodeURI(outputPath),
        enable: isDev
      },
      pretty: isDev ? true : false
    })
  ]
}
