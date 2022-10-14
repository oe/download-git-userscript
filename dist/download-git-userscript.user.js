// ==UserScript==
// @name              Download github repo sub-folder
// @version           0.5.1
// @author            Saiya
// @description       download github sub-folder via one click, copy the single file's source code easily
// @supportURL        https://github.com/oe/download-git-userscript/issues
// @match             https://github.com/*
// @match             https://gist.github.com/*
// @namespace         https://app.evecalm.com
// @name:zh-CN        在线下载Github仓库文件夹
// @description:zh-CN 无需克隆GitHub仓库, 一键在线下载 Github仓库子文件夹; 同时还能在源码详情页一键复制源码
// @homepageURL       https://github.com/oe/download-git-userscript
// @licence           MIT
// @icon              https://github.githubassets.com/pinned-octocat.svg
// @connect           cdn.jsdelivr.net
// @grant             GM_setClipboard
// @grant             GM_xmlhttpRequest
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
const utils = __importStar(__webpack_require__(1));
(function () {
    const DOWNLOAD_BTN_ID = 'xiu-download-btn';
    const STYLE_ELEMENT_ID = 'xiu-style-element';
    main();
    // observePageChange()
    document.addEventListener('DOMSubtreeModified', onBodyChanged);
    function main() {
        if (!utils.isRepo())
            return;
        addDownloadBtn();
        addDownload2FileList();
    }
    let tid = 0;
    function onBodyChanged() {
        clearTimeout(tid);
        // @ts-ignore
        tid = setTimeout(addDownloadBtn, 100);
    }
    function addDownloadBtn() {
        let $navi = document.querySelector('.application-main .file-navigation');
        const $childCount = $navi.childElementCount;
        if (!$navi) {
            $navi = document.getElementById('blob-more-options-details');
            if (!$navi)
                return;
            $navi = $navi.parentElement;
        }
        if ($navi && $childCount < 4) {
            $navi.className = 'file-navigation d-flex flex-items-start';
        }
        const downloadBtn = getDownloadBtn($navi);
        if ($navi.contains(downloadBtn))
            return;
        $navi.appendChild(downloadBtn);
    }
    function getDownloadBtn($fileNavi) {
        let downloadBtn = document.getElementById(DOWNLOAD_BTN_ID);
        if (!downloadBtn) {
            downloadBtn = document.createElement('a');
            downloadBtn.id = DOWNLOAD_BTN_ID;
        }
        downloadBtn.className = 'btn d-none d-md-block ml-2';
        downloadBtn.target = '_blank';
        let url = '';
        if (utils.isRepoRootDir()) {
            const link = $fileNavi.querySelector('get-repo a[href$=".zip"]');
            url = link.href;
        }
        else {
            url = utils.getGithubDownloadUrl(utils.getCurrentUrlPath());
        }
        downloadBtn.textContent = 'Download';
        downloadBtn.href = url;
        return downloadBtn;
    }
    function addDownload2FileList() {
        if (document.getElementById(STYLE_ELEMENT_ID))
            return;
        const style = document.createElement('style');
        style.id = STYLE_ELEMENT_ID;
        const styleContent = `
    .Box .Box-row > [role="gridcell"]:first-child:after {
      position: absolute;
      left: 20px;
      top: 10px;
      opacity: 0.6;
      pointer-events: none;
      content: '↓';
      font-size: 0.8em;
    }

    .Box .Box-row > [role="gridcell"]:first-child > svg {
      cursor: pointer;
    }
    `;
        style.textContent = styleContent;
        document.head.appendChild(style);
        addEvent2FileIcon();
    }
    function addEvent2FileIcon() {
        document.documentElement.addEventListener('click', (e) => {
            var _a, _b, _c, _d;
            // @ts-ignore
            const target = (e.target && e.target.ownerSVGElement || e.target);
            if (!target || (target.tagName || '').toLowerCase() !== 'svg')
                return;
            const label = target.getAttribute('aria-label') || '';
            if (!['Directory', 'File'].includes(label))
                return;
            const url = (_d = (_c = (_b = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.nextElementSibling) === null || _b === void 0 ? void 0 : _b.querySelector) === null || _c === void 0 ? void 0 : _c.call(_b, 'a')) === null || _d === void 0 ? void 0 : _d.href;
            if (!url)
                return;
            const isFile = label === 'File';
            utils.openLink(utils.getGithubDownloadUrl(url, isFile));
        });
    }
})();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getGithubDownloadUrl = exports.openLink = exports.getCurrentUrlPath = exports.getRawBtn = exports.getUrlTextResponse = exports.isTextBasedSinglePage = exports.isRepoRootDir = exports.isPrivateRepo = exports.isRepo = exports.isGist = void 0;
/**
 * is gist website
 */
function isGist() {
    return location.hostname === 'gist.github.com';
}
exports.isGist = isGist;
function isRepo() {
    if (!document.querySelector('.repository-content'))
        return false;
    const meta = document.querySelector('meta[name="selected-link"]');
    if (meta && meta.getAttribute('value') === 'repo_commits')
        return false;
    if (document.querySelector('.js-navigation-container>.TimelineItem'))
        return false;
    return true;
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
    // https://github.com/oe/search/raw/gh-pages/app-icon-retina.f492fc13.png
    // https://cdn.jsdelivr.net/gh/oe/search@gh-pages/app-icon-retina.f492fc13.png
    // https://github.com/oe/search/raw/master/CNAME
    let apiUrl = url
        .replace('github.com/', 'cdn.jsdelivr.net/gh/')
        .replace('/raw/', '@');
    return new Promise((resolve, reject) => {
        // @ts-ignore
        GM_xmlhttpRequest({
            url: apiUrl,
            method: 'GET',
            onload: (s) => {
                resolve(s.responseText);
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
function getGithubDownloadUrl(url, isFile) {
    if (isFile) {
        try {
            const u = new URL(url);
            let paths = u.pathname.split('/');
            paths[3] = 'raw';
            u.pathname = paths.join('/');
            return u.href;
        }
        catch (error) { }
    }
    return `https://downgit.evecalm.com/#/home?url=${encodeURIComponent(url)}`;
}
exports.getGithubDownloadUrl = getGithubDownloadUrl;


/***/ })
/******/ ]);