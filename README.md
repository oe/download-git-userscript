# Download Github User script
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

### install this user script
  



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