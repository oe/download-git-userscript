// ==UserScript==
// @name        download-git-userscript
// @version     0.0.1.alpha
// @author      Saiya
// @description download github directory via one click
// @match       https://github.com/*
// @match       https://gist.github.com/*
// @grant       GM_download
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
                // @ts-ignore
                GM_download({ url: rawBtn.href, name: rawBtn.href.split('/').pop(), onerror: console.warn });
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


/***/ })
/******/ ]);