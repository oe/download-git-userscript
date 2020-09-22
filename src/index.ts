import * as utils from './utils'
import { getRawBtn } from './utils'
(function () {
  main()
  observePageChange()


  function main() {
    if (!utils.isRepo()) return
    addDownloadBtn()
    addCopyTextBtn()
  }

  function observePageChange() {
    // Select the node that will be observed for mutations
    let targetNode: HTMLElement | null
    if (utils.isGist()) {
      targetNode = document.querySelector('#gist-pjax-container')
    } else {
      // to deal with octree, it append elements as siblings of #js-repo-pjax-container 
      //   which is inside of child of .application-main
      targetNode = document.querySelector('.application-main')
      if (targetNode) targetNode = targetNode.firstElementChild as HTMLElement
    }
    if (!targetNode) return
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList: MutationRecord[]) {
      console.log('mutation change', mutationsList)
      main()
    }
  
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback)
  
    // Start observing the target node for configured mutations
    observer.observe(targetNode, { childList: true, subtree: false })    
  }

  function addDownloadBtn() {
    const $fileNavi = utils.getFileNavi()
    if (!$fileNavi) return
    

    let btn = document.getElementById('xiu-download-btn') as HTMLAnchorElement
    if (!btn) {
      btn = document.createElement('a')
      btn.id = 'xiu-download-btn'
    }
    btn.className = 'btn ml-2 d-none d-md-block'
    btn.target = '_blank'
    let url = ''
    if (utils.isRepoRootDir()) {
      const link = $fileNavi.querySelector('get-repo a[href$=".zip"]') as HTMLAnchorElement
      url = link.href
    } else if (utils.getRawBtn()) {
      const rawBtn = utils.getRawBtn() as HTMLAnchorElement
      url = rawBtn.href
      btn.onclick = function (e) {
        e.preventDefault()
        const fileName = rawBtn.href.split('/').pop()!
        // @ts-ignore
        GM_download({
          url: rawBtn.href, 
          name: fileName, onerror: (err: any) => {
            if (confirm(err.error + `: you may need add extension ".${fileName.split('.').pop()}" to Tampermonkey's whitelist. Click OK to see how.`)) {
              utils.openLink('https://github.com/oe/download-git-userscript#before-using')
            }
          }})
      }
    } else {
      url = `https://minhaskamal.github.io/DownGit/#/home?url=${encodeURIComponent(utils.getCurrentUrlPath())}`
    }
    btn.textContent = 'Download'
    btn.href = url
    $fileNavi.appendChild(btn)
  }

  function addCopyTextBtn () {
    if (!utils.isTextBasedSinglePage() || document.getElementById('xiu-copy-btn')) {
      return
    }
    const rawBtn = getRawBtn() as HTMLAnchorElement
    // <a href="/Kyome22/IronKeyboard/raw/master/Keyboard/Line1.swift" id="raw-url" role="button" class="btn btn-sm BtnGroup-item ">Raw</a>
    const copyBtn = document.createElement('a')
    copyBtn.setAttribute('role', 'button')
    copyBtn.className = 'btn btn-sm BtnGroup-item'
    copyBtn.href = '#'
    copyBtn.id = 'xiu-copy-btn'
    copyBtn.textContent = 'Copy'
    copyBtn.onclick = async (e) => {
      e.preventDefault()
      try {
        const text = await utils.getUrlTextResponse(rawBtn.href)
        // @ts-ignore
        GM_setClipboard(text)
      } catch (error) {
        console.warn(error)
      }
    }

    rawBtn.insertAdjacentElement('beforebegin', copyBtn)

  }

})()
