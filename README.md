# Download github userscript


## before using
This script use Tampermonkey's `Download` feature to download single code file, and it follows Tampermonkey's Secure restrictions:
>  for security reasons the file extension needs to be whitelisted at Tampermonkey's options page

You can added your custom file extension the whitelist by follow steps

1. open Tampermonkey extension settings page, in Chrome it's `chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=settings`
2. change `General` -> `Config mode` to `Advanced`
3. Scroll to `Downloads BETA`, add file extension Regexp to the `Whitelisted File Extensions:`, e.g.:
```regexp
/\.(js|ts|jsx|tsx|json|java|go|cpp|c|swift|cmd|sh|md|markdown|rb)$/
```

you can add `/\..*$/` to the list at your own risk



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