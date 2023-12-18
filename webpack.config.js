const path = require('path')
const { UserscriptPlugin } = require('webpack-userscript')
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
    server: {
      type: enableHTTPS ? 'https' : 'http',
    },
    client: {
      overlay: false,
      progress: false,
    },
    static: false,
    webSocketServer: false,
    port: PORT,
    hot: false,
    magicHtml: true,
    liveReload: false
  },
  plugins: [
    new CleanWebpackPlugin(),
    new UserscriptPlugin({
      headers ({ name, version }) {
        return {
          name: 'Download github repo sub-folder',
          version: isDev ? `${version}-beta.${Date.now()}` : version,
          author: 'Saiya',
          namespace: 'https://app.evecalm.com',
          description:
            "download github sub-folder via one click, copy the single file's source code easily",
          homepageURL: 'https://github.com/oe/download-git-userscript',
          // licence: 'MIT',
          icon: 'https://github.githubassets.com/pinned-octocat.svg',
          supportURL: 'https://github.com/oe/download-git-userscript/issues',
          connect: ['cdn.jsdelivr.net'],
          match: ['https://github.com/*', 'https://gist.github.com/*'],
          grant: ['GM_setClipboard', 'GM_xmlhttpRequest'],
          noframes: true
        };
      },
      i18n: {
        'zh-CN': {
          name: '在线下载Github仓库文件夹',
          description:
            '无需克隆GitHub仓库, 一键在线下载 Github仓库子文件夹; 同时还能在源码详情页一键复制源码'
        }
      },
      proxyScript: {
        baseURL: enableHTTPS ? `https://localhost:${PORT}` : `http://localhost:${PORT}`,
        enable: isDev
      },
      pretty: isDev
    })
  ]
}
