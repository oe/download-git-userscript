// ==UserScript==
// @name        Download github repo dir
// @version     0.2.1
// @author      Saiya
// @description download github directory via one click
// @supportURL  https://github.com/oe/download-git-userscript/issues
// @match       https://github.com/*
// @match       https://gist.github.com/*
// @connect     raw.githubusercontent.com
// @grant       GM_download
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.openLink = exports.getCurrentUrlPath = exports.getRawBtn = exports.getUrlTextResponse = exports.isTextBasedSinglePage = exports.isRepoRootDir = exports.isPrivateRepo = exports.isRepo = exports.isGist = void 0;
/**
 * is gist website
 */
function isGist() {
    return location.hostname === 'gist.github.com';
}
exports.isGist = isGist;
function isRepo() {
    return document.querySelector('.repository-content');
}
exports.isRepo = isRepo;
function isPrivateRepo() {
    const label = document.querySelector('#js-repo-pjax-container .hide-full-screen .Label');
    return label && label.textContent === 'Private';
}
exports.isPrivateRepo = isPrivateRepo;
function isRepoRootDir() {
    return !!document.querySelector('.repository-content  get-repo');
}
exports.isRepoRootDir = isRepoRootDir;
function isTextBasedSinglePage() {
    if (!getRawBtn())
        return;
    if (document.getElementById('readme'))
        return true;
    const boxBody = document.querySelector('table.highlight');
    if (boxBody)
        return true;
    return false;
}
exports.isTextBasedSinglePage = isTextBasedSinglePage;
function getUrlTextResponse(url) {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            ontimeout: reject,
            onabort: reject,
            onerror: reject,
            onload: (res) => {
                if (res.responseText) {
                    resolve(res.responseText);
                }
                else {
                    reject(res);
                }
            }
        });
    });
}
exports.getUrlTextResponse = getUrlTextResponse;
// if is single file page, then it has a raw btn
function getRawBtn() {
    return document.getElementById('raw-url');
}
exports.getRawBtn = getRawBtn;
// remove qeurystring & hash
function getCurrentUrlPath() {
    const url = location.origin + location.pathname;
    return url.replace(/\/$/, '');
}
exports.getCurrentUrlPath = getCurrentUrlPath;
function openLink(url) {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = url;
    link.click();
}
exports.openLink = openLink;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils = __importStar(__webpack_require__(0));
const utils_1 = __webpack_require__(0);
(function () {
    main();
    observePageChange();
    function main() {
        if (!utils.isRepo())
            return;
        addDownloadBtn();
        addCopyTextBtn();
    }
    function observePageChange() {
        // Select the node that will be observed for mutations
        let targetNode;
        if (utils.isGist()) {
            targetNode = document.querySelector('#gist-pjax-container');
        }
        else {
            // to deal with octree, it append elements as siblings of #js-repo-pjax-container 
            //   which is inside of child of .application-main
            targetNode = document.querySelector('#js-repo-pjax-container');
        }
        if (!targetNode)
            return;
        // Callback function to execute when mutations are observed
        const callback = function (mutationsList) {
            console.log('mutation change', mutationsList);
            main();
        };
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
        // Start observing the target node for configured mutations
        observer.observe(targetNode, { childList: true, subtree: false });
    }
    function addDownloadBtn() {
        let $navi = document.querySelector('.repository-content .file-navigation');
        if ($navi) {
            const downloadBtn = getDownloadBtn($navi);
            downloadBtn.className += ' ml-2';
            $navi.appendChild(downloadBtn);
            return;
        }
        const moreBtn = document.querySelector('#blob-more-options-details');
        if (!moreBtn)
            return;
        $navi = moreBtn.parentElement;
        const downloadBtn = getDownloadBtn($navi);
        downloadBtn.className += ' mr-2';
        moreBtn.insertAdjacentElement('beforebegin', downloadBtn);
    }
    function getDownloadBtn($fileNavi) {
        let downloadBtn = document.getElementById('xiu-download-btn');
        if (!downloadBtn) {
            downloadBtn = document.createElement('a');
            downloadBtn.id = 'xiu-download-btn';
        }
        downloadBtn.className = 'btn d-none d-md-block';
        downloadBtn.target = '_blank';
        let url = '';
        if (utils.isRepoRootDir()) {
            const link = $fileNavi.querySelector('get-repo a[href$=".zip"]');
            url = link.href;
        }
        else if (utils.getRawBtn()) {
            const rawBtn = utils.getRawBtn();
            url = rawBtn.href;
            downloadBtn.onclick = function (e) {
                e.preventDefault();
                const fileName = rawBtn.href.split('/').pop();
                // @ts-ignore
                GM_download({
                    url: rawBtn.href,
                    name: fileName,
                    onerror: (err) => {
                        if (confirm(err.error + `: you may need add extension ".${fileName.split('.').pop()}" to Tampermonkey's whitelist. Click OK to see how.`)) {
                            utils.openLink('https://github.com/oe/download-git-userscript#before-using');
                        }
                    }
                });
            };
        }
        else {
            url = `https://minhaskamal.github.io/DownGit/#/home?url=${encodeURIComponent(utils.getCurrentUrlPath())}`;
        }
        downloadBtn.textContent = 'Download';
        downloadBtn.href = url;
        return downloadBtn;
    }
    function addCopyTextBtn() {
        if (!utils.isTextBasedSinglePage() || document.getElementById('xiu-copy-btn')) {
            return;
        }
        const rawBtn = utils_1.getRawBtn();
        // <a href="/Kyome22/IronKeyboard/raw/master/Keyboard/Line1.swift" id="raw-url" role="button" class="btn btn-sm BtnGroup-item ">Raw</a>
        const copyBtn = document.createElement('a');
        copyBtn.setAttribute('role', 'button');
        copyBtn.className = 'btn btn-sm BtnGroup-item';
        copyBtn.href = '#';
        copyBtn.id = 'xiu-copy-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = async (e) => {
            e.preventDefault();
            try {
                const text = await utils.getUrlTextResponse(rawBtn.href);
                // @ts-ignore
                GM_setClipboard(text);
            }
            catch (error) {
                console.warn(error);
            }
        };
        rawBtn.insertAdjacentElement('beforebegin', copyBtn);
    }
})();


/***/ })
/******/ ]);