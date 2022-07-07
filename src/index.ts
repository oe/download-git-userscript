import * as utils from './utils'

(function () {
  const DOWNLOAD_BTN_ID = 'xiu-download-btn'
  const STYLE_ELEMENT_ID = 'xiu-style-element'
  main()
  // observePageChange()
  document.addEventListener('DOMSubtreeModified', onBodyChanged)


  function main() {
    if (!utils.isRepo()) return
    addDownloadBtn()
    addDownload2FileList()
  }

  let tid = 0
  function onBodyChanged() {
    clearTimeout(tid)
    // @ts-ignore
    tid = setTimeout(addDownloadBtn, 100);
  }

  function addDownloadBtn() {
    let $navi = document.querySelector('.application-main .file-navigation') as HTMLElement
    if (!$navi) {
      $navi = document.getElementById('blob-more-options-details') as HTMLElement
      if (!$navi) return
      $navi = $navi.parentElement as HTMLElement
    }
    const downloadBtn = getDownloadBtn($navi)
    if ($navi.contains(downloadBtn)) return
    $navi.appendChild(downloadBtn)
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
      url = utils.getGithubDownloadUrl(utils.getCurrentUrlPath())
    }
    downloadBtn.textContent = 'Download'
    downloadBtn.href = url
    return downloadBtn
  }

  function addDownload2FileList() {
    if (document.getElementById(STYLE_ELEMENT_ID)) return
    const style = document.createElement('style')
    style.id = STYLE_ELEMENT_ID

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
    `
    style.textContent = styleContent
    document.head.appendChild(style)
    addEvent2FileIcon()
  }

  function addEvent2FileIcon() {
    document.documentElement.addEventListener('click', (e: MouseEvent) => {
      // @ts-ignore
      const target = (e.target && e.target.ownerSVGElement || e.target) as HTMLElement
      if (!target || (target.tagName || '').toLowerCase() !== 'svg') return
      const label = target.getAttribute('aria-label') || ''
      if (!['Directory', 'File'].includes(label)) return
      const url = target.parentElement?.nextElementSibling?.querySelector?.('a')?.href
      if (!url) return
      const isFile = label === 'File'
      utils.openLink(utils.getGithubDownloadUrl(url, isFile))
    })
  }
})()
