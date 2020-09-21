import { saveAs } from 'file-saver'
(function () {
  injectDownload()

  // Select the node that will be observed for mutations
  let targetNode
  if (isGist()) {
    targetNode = document.querySelector('#gist-pjax-container')
  } else {
    // to deal with octree, it append elements as siblings of #js-repo-pjax-container 
    //   which is inside of child of .application-main
    targetNode = document.querySelector('.application-main')
    if (targetNode) targetNode = targetNode.firstElementChild
  }
  if (!targetNode) return

  // Callback function to execute when mutations are observed
  const callback = function(mutationsList: MutationRecord[]) {
    console.log('mutation change', mutationsList)
    injectDownload()
  }

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback)

  // Start observing the target node for configured mutations
  observer.observe(targetNode, { childList: true, subtree: false })

  function isGist() {
    return location.hostname === 'gist.github.com'
  }

  function isRepo() {
    return document.querySelector('.repository-content')
  }

  function getFileNavi() {
    let $navi = document.querySelector('.repository-content .file-navigation')
    if (!$navi) {
      $navi = document.querySelector('#blob-more-options-details')
      if ($navi) {
        $navi = $navi.parentElement
      }
    }
    return $navi
  }

  function isPrivateRepo() {
    const label = document.querySelector('#js-repo-pjax-container .hide-full-screen .Label')
    return label && label.textContent === 'Private'
  }

  function isRepoRootDir() {
    const $fileNavi = getFileNavi()
    if (!$fileNavi) return false
    return !!$fileNavi.querySelector('get-repo')
  }
  // if is single file page, then it has a raw btn
  function getRawBtn() {
    return document.getElementById('raw-url')
  }

  function createDownloadBtn() {
    let btn = document.getElementById('xiu-download-btn') as HTMLAnchorElement
    if (!btn) {
      btn = document.createElement('a')
      btn.id = 'xiu-download-btn'
    }
    btn.className = 'btn ml-2 d-none d-md-block'
    btn.target = '_blank'
    let url = ''
    if (isRepoRootDir()) {
      const $fileNavi = getFileNavi()!
      const link = $fileNavi.querySelector('get-repo a[href$=".zip"]') as HTMLAnchorElement
      url = link.href
    } else if (getRawBtn()) {
      const rawBtn = getRawBtn() as HTMLAnchorElement
      url = ''
      btn.onclick = function (e) {
        e.preventDefault()
        console.warn('saveasss', rawBtn.href)
        saveAs(rawBtn.href, rawBtn.href.split('/').pop())
      }
      // btn.download = ''
    } else {
      url = `https://minhaskamal.github.io/DownGit/#/home?url=${encodeURIComponent(getCurrentUrlPath())}`
    }
    btn.textContent = 'Download'
    btn.href = url
    return btn
  }
  // remove qeurystring & hash
  function getCurrentUrlPath() {
    const url = location.origin + location.pathname
    return url.replace(/\/$/, '')
  }

  function injectDownload() {
    const $fileNavi = getFileNavi()
    if (!isRepo() || !$fileNavi) {
      console.log('not repo')
      return
    }
    const btn = createDownloadBtn()
    $fileNavi.appendChild(btn)
    console.log('is repo')
  }
})()
