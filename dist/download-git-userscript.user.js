// ==UserScript==
// @name        download-git-userscript
// @version     0.0.1.alpha
// @author      Saiya
// @description download github directory via one click
// @match       https://github.com/*
// @match       https://gist.github.com/*
// @noframes    
// ==/UserScript==

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const file_saver_1 = __webpack_require__(1);
(function () {
    injectDownload();
    // Select the node that will be observed for mutations
    let targetNode;
    if (isGist()) {
        targetNode = document.querySelector('#gist-pjax-container');
    }
    else {
        // to deal with octree, it append elements as siblings of #js-repo-pjax-container 
        //   which is inside of child of .application-main
        targetNode = document.querySelector('.application-main');
        if (targetNode)
            targetNode = targetNode.firstElementChild;
    }
    if (!targetNode)
        return;
    // Callback function to execute when mutations are observed
    const callback = function (mutationsList) {
        console.log('mutation change', mutationsList);
        injectDownload();
    };
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    // Start observing the target node for configured mutations
    observer.observe(targetNode, { childList: true, subtree: false });
    function isGist() {
        return location.hostname === 'gist.github.com';
    }
    function isRepo() {
        return document.querySelector('.repository-content');
    }
    function getFileNavi() {
        let $navi = document.querySelector('.repository-content .file-navigation');
        if (!$navi) {
            $navi = document.querySelector('#blob-more-options-details');
            if ($navi) {
                $navi = $navi.parentElement;
            }
        }
        return $navi;
    }
    function isPrivateRepo() {
        const label = document.querySelector('#js-repo-pjax-container .hide-full-screen .Label');
        return label && label.textContent === 'Private';
    }
    function isRepoRootDir() {
        const $fileNavi = getFileNavi();
        if (!$fileNavi)
            return false;
        return !!$fileNavi.querySelector('get-repo');
    }
    // if is single file page, then it has a raw btn
    function getRawBtn() {
        return document.getElementById('raw-url');
    }
    function createDownloadBtn() {
        let btn = document.getElementById('xiu-download-btn');
        if (!btn) {
            btn = document.createElement('a');
            btn.id = 'xiu-download-btn';
        }
        btn.className = 'btn ml-2 d-none d-md-block';
        btn.target = '_blank';
        let url = '';
        if (isRepoRootDir()) {
            const $fileNavi = getFileNavi();
            const link = $fileNavi.querySelector('get-repo a[href$=".zip"]');
            url = link.href;
        }
        else if (getRawBtn()) {
            const rawBtn = getRawBtn();
            url = '';
            btn.onclick = function (e) {
                e.preventDefault();
                console.warn('saveasss', rawBtn.href);
                file_saver_1.saveAs(rawBtn.href, rawBtn.href.split('/').pop());
            };
            // btn.download = ''
        }
        else {
            url = `https://minhaskamal.github.io/DownGit/#/home?url=${encodeURIComponent(getCurrentUrlPath())}`;
        }
        btn.textContent = 'Download';
        btn.href = url;
        return btn;
    }
    // remove qeurystring & hash
    function getCurrentUrlPath() {
        const url = location.origin + location.pathname;
        return url.replace(/\/$/, '');
    }
    function injectDownload() {
        const $fileNavi = getFileNavi();
        if (!isRepo() || !$fileNavi) {
            console.log('not repo');
            return;
        }
        const btn = createDownloadBtn();
        $fileNavi.appendChild(btn);
        console.log('is repo');
    }
})();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (a, b) {
  if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (b),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else {}
})(this, function () {
  "use strict";

  function b(a, b) {
    return "undefined" == typeof b ? b = {
      autoBom: !1
    } : "object" != _typeof(b) && (console.warn("Deprecated: Expected third argument to be a object"), b = {
      autoBom: !b
    }), b.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type) ? new Blob(["\uFEFF", a], {
      type: a.type
    }) : a;
  }

  function c(b, c, d) {
    var e = new XMLHttpRequest();
    e.open("GET", b), e.responseType = "blob", e.onload = function () {
      a(e.response, c, d);
    }, e.onerror = function () {
      console.error("could not download file");
    }, e.send();
  }

  function d(a) {
    var b = new XMLHttpRequest();
    b.open("HEAD", a, !1);

    try {
      b.send();
    } catch (a) {}

    return 200 <= b.status && 299 >= b.status;
  }

  function e(a) {
    try {
      a.dispatchEvent(new MouseEvent("click"));
    } catch (c) {
      var b = document.createEvent("MouseEvents");
      b.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), a.dispatchEvent(b);
    }
  }

  var f = "object" == (typeof window === "undefined" ? "undefined" : _typeof(window)) && window.window === window ? window : "object" == (typeof self === "undefined" ? "undefined" : _typeof(self)) && self.self === self ? self : "object" == (typeof global === "undefined" ? "undefined" : _typeof(global)) && global.global === global ? global : void 0,
      a = f.saveAs || ("object" != (typeof window === "undefined" ? "undefined" : _typeof(window)) || window !== f ? function () {} : "download" in HTMLAnchorElement.prototype ? function (b, g, h) {
    var i = f.URL || f.webkitURL,
        j = document.createElement("a");
    g = g || b.name || "download", j.download = g, j.rel = "noopener", "string" == typeof b ? (j.href = b, j.origin === location.origin ? e(j) : d(j.href) ? c(b, g, h) : e(j, j.target = "_blank")) : (j.href = i.createObjectURL(b), setTimeout(function () {
      i.revokeObjectURL(j.href);
    }, 4E4), setTimeout(function () {
      e(j);
    }, 0));
  } : "msSaveOrOpenBlob" in navigator ? function (f, g, h) {
    if (g = g || f.name || "download", "string" != typeof f) navigator.msSaveOrOpenBlob(b(f, h), g);else if (d(f)) c(f, g, h);else {
      var i = document.createElement("a");
      i.href = f, i.target = "_blank", setTimeout(function () {
        e(i);
      });
    }
  } : function (a, b, d, e) {
    if (e = e || open("", "_blank"), e && (e.document.title = e.document.body.innerText = "downloading..."), "string" == typeof a) return c(a, b, d);
    var g = "application/octet-stream" === a.type,
        h = /constructor/i.test(f.HTMLElement) || f.safari,
        i = /CriOS\/[\d]+/.test(navigator.userAgent);

    if ((i || g && h) && "object" == (typeof FileReader === "undefined" ? "undefined" : _typeof(FileReader))) {
      var j = new FileReader();
      j.onloadend = function () {
        var a = j.result;
        a = i ? a : a.replace(/^data:[^;]*;/, "data:attachment/file;"), e ? e.location.href = a : location = a, e = null;
      }, j.readAsDataURL(a);
    } else {
      var k = f.URL || f.webkitURL,
          l = k.createObjectURL(a);
      e ? e.location = l : location.href = l, e = null, setTimeout(function () {
        k.revokeObjectURL(l);
      }, 4E4);
    }
  });
  f.saveAs = a.saveAs = a,  true && (module.exports = a);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var g; // This works in non-strict mode

g = function () {
  return this;
}();

try {
  // This works if eval is allowed (see CSP)
  g = g || new Function("return this")();
} catch (e) {
  // This works if the window reference is available
  if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
} // g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}


module.exports = g;

/***/ })
/******/ ]);