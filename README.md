# Download Github Sub-folder User script

[中文说明](#中文说明)

> You can create your own userscript power by webpack/es6/typescript/etc by starting from this [template](https://github.com/oe/webpack-userscript-template)

It's a useful user script for Github users:
1. allow you to donwload a sub-folder of a repo online without cloning the whole repository
to your machine
2. allow you to copy source code in repo's single file view

All its features are seamless integrated with Github, and works great with [octotree](https://github.com/ovity/octotree).

![Download Github screenshot](./screenshot.png)

## Usage

### Install a user script manager
To use user scripts you need to first install a user script manager. Which user script manager you can use depends on which browser you use.

  * Chrome: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) or [Violentmonkey](https://chrome.google.com/webstore/detail/violent-monkey/jinjaccalgkegednnccohejagnlnfdag)
  * Firefox: [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/), [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/), or [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/)
  * Safari: [Tampermonkey](http://tampermonkey.net/?browser=safari) or [Userscripts](https://apps.apple.com/app/userscripts/id1463298887)
  * Microsoft Edge: [Tampermonkey](https://www.microsoft.com/store/p/tampermonkey/9nblggh5162s)
  * Opera: [Tampermonkey](https://addons.opera.com/extensions/details/tampermonkey-beta/) or [Violentmonkey](https://violentmonkey.github.io/get-it/)
  * Maxthon: [Violentmonkey](http://extension.maxthon.com/detail/index.php?view_id=1680)
  * Dolphin: [Tampermonkey](https://play.google.com/store/apps/details?id=net.tampermonkey.dolphin)
  * UC: [Tampermonkey](https://www.tampermonkey.net/?browser=ucweb&ext=dhdg)

### Install this user script
  
[click here to install this script](https://greasyfork.org/scripts/411834-download-github-repo-sub-folder/code/Download%20github%20repo%20sub-folder.user.js)


### Configure the script manager
This script use script manager's `Download` feature to download single code file, and it must follow script manager's Secure restrictions, like [Tampermonkey](https://www.tampermonkey.net/documentation.php?ext=dhdg#GM_download) says:
>  for security reasons the file extension needs to be whitelisted at Tampermonkey's options page

The following steps showing you how to config that in Tampermonkey

You can added your custom file extension the whitelist by follow steps:

1. open Tampermonkey extension settings page, in Chrome it's `chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=settings`
2. change `General` -> `Config mode` to `Advanced`
3. Scroll to `Downloads BETA`, add file extension Regexp to the `Whitelisted File Extensions:`, e.g.:
```regexp
/\.(js|ts|jsx|tsx|json|java|go|cpp|c|swift|cmd|sh|md|markdown|rb)$/
```

or you can add `/\..*$/` to the list to allow any file extensions at your own risk


### Credits
This script  use [downgit](https://minhaskamal.github.io/DownGit/)([sourcecode](https://github.com/minhaskamal/DownGit/)) to download github sub-folder


# 中文说明
无需克隆GitHub仓库, 一键在线下载 Github仓库子文件夹; 同时还能在源码详情页一键复制源码.

下载按钮 和 复制按钮无缝和 Github.com 集成, 示例效果如下:

![Download Github screenshot](./screenshot.png)

credits: 在线下载Github仓库的文件夹功能使用开源项目 [downgit](https://minhaskamal.github.io/DownGit/)([源码](https://github.com/minhaskamal/DownGit/)) 实现


## 使用说明

### 安装脚本管理器

Chrome 用户推荐安装浏览器扩展: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) 

其他选择可参考: [安装一个用户脚本管理器](https://greasyfork.org/zh-CN#home-step-1)

### 脚本管理器配置
本脚本的下载Github单个文件的功能依赖脚本管理器的 `GM_download` 权限, 需遵循脚本管理器的安全策略, 如 [Tampermonkey](https://www.tampermonkey.net/documentation.php?ext=dhdg#GM_download) 官方所说:

> 因安全原因所下载的文件后缀名必须添加至 Tampermonkey 的白名单中

你可以按下述步骤来设置 Tampermonkey:
1. 在 Chrome 中打开 Tampermonkey 的设置页面, 你可以直接复制 `chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=settings` 在Chrome地址栏中打开
2. 在 `General` 设置组 将 `Config mode` 改为 `Advanced`
3. 然后再滚动到页面底部, 找到 `Downloads BETA`, 将你需要下载的文件后缀追加至 `Whitelisted File Extensions:` 中:
   > 如可以添加常用代码文件后缀 `/\.(js|ts|jsx|tsx|json|java|go|cpp|c|swift|cmd|sh|md|markdown|rb)$/`  
   > 如果嫌麻烦, 也可以添加 `/\..*$/` 来允许下载任意后缀文件, 需自行注意所下载文件的安全问题





## develop steps

### change settings of chrome

1. navigate to `chrome://flags/#allow-insecure-localhost`, enable insecure localhost
2. navigate to `chrome://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo`(Chrome manage extensions page of `Tampermonkey`) and enable `Allow access to file URLs` (you need to manual reload page when dev userscript, see [#475](https://github.com/Tampermonkey/tampermonkey/issues/475#issuecomment-348594785) for more detail)

### dev

1. `yarn`
2. `yarn dev`
3. open <https://127.0.0.1/download-git-userscript.proxy.user.js> in browser(click  `Advanced` -> `proceed` if it shows a security warning ) to install the proxy script
4. dev code, reload github.com webpage after userscript changed



## references
1. [Tampermonkey docs](https://www.tampermonkey.net/documentation.php)
