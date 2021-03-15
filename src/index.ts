import * as utils from './utils'
import { getRawBtn } from './utils'
(function () {
  const DOWNLOAD_BTN_ID = 'xiu-download-btn'
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
      targetNode = document.querySelector('#js-repo-pjax-container')
    }
    if (!targetNode) return
    let tid: any = 0
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList: MutationRecord[]) {
      clearTimeout(tid)
      // if download button exists, and textContent just been changed
      //    e.g. translated by browser
      if (mutationsList.some(mutation => {
        if (mutation.type === 'childList' && 
          (mutation.target as HTMLElement).id === DOWNLOAD_BTN_ID &&
          mutation.target.textContent !== 'Download'
          ) return true
      })) return

      tid = setTimeout(main, 200)
    }
  
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback)
  
    // Start observing the target node for configured mutations
    observer.observe(targetNode, { childList: true, subtree: true })    
  }

  function addDownloadBtn() {
    let $navi = document.querySelector('.repository-content .file-navigation') as HTMLElement
    if ($navi) {
      const downloadBtn = getDownloadBtn($navi)
      if ($navi.contains(downloadBtn)) return
      $navi.appendChild(downloadBtn)
      return
    }
    const moreBtn = document.querySelector('#blob-more-options-details')
    if (!moreBtn) return
    $navi = moreBtn.parentElement as HTMLElement
    const downloadBtn = getDownloadBtn($navi)
    if ($navi.contains(downloadBtn)) return
    moreBtn.insertAdjacentElement('afterend', downloadBtn)
  }

  function getDownloadBtn($fileNavi: HTMLElement) {
    let downloadBtn = document.getElementById(DOWNLOAD_BTN_ID) as HTMLAnchorElement | null
    if (!downloadBtn) {
      downloadBtn = document.createElement('a')
      downloadBtn.id = DOWNLOAD_BTN_ID
    }
    downloadBtn.className = 'btn d-none d-md-block ml-2'
    downloadBtn.target = '_blank'
    let url = ''
    if (utils.isRepoRootDir()) {
      const link = $fileNavi.querySelector('get-repo a[href$=".zip"]') as HTMLAnchorElement
      url = link.href
    } else {
      url = `https://downgit.evecalm.com/#/home?url=${encodeURIComponent(utils.getCurrentUrlPath())}`
    }
    downloadBtn.textContent = 'Download'
    downloadBtn.href = url
    return downloadBtn
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
