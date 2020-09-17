# Download github userscript


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