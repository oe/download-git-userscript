(function () {
  main()

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
    const btn = document.createElement('a')
    btn.className = 'btn ml-2 d-none d-md-block'
    btn.target = '_blank'
    let url = ''
    if (isRepoRootDir()) {
      const $fileNavi = getFileNavi()!
      const link = $fileNavi.querySelector('get-repo a[href$=".zip"]') as HTMLAnchorElement
      url = link.href
    } else if (getRawBtn()) {
      const rawBtn = getRawBtn() as HTMLAnchorElement
      url = rawBtn.href
      btn.download = ''
    } else {
      url = `http://minhaskamal.github.io/DownGit?url=${encodeURIComponent(getCurrentUrlPath())}`
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

  function main() {
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
