import * as utils from './utils'

(function () {
  const DOWNLOAD_BTN_ID = 'xiu-download-btn'
  const STYLE_ELEMENT_ID = 'xiu-style-element'
  let tid = 0
  main()
  // observePageChange()
  document.addEventListener('DOMSubtreeModified', onBodyChanged)

  function main() {
    if (!utils.isRepo()) return
    addDownloadBtn()
    addDownload2FileList()
  }

  function onBodyChanged() {
    clearTimeout(tid)
    // @ts-ignore
    tid = setTimeout(main, 100);
  }

  function addDownloadBtn() {
    let $navi = document.querySelector('.application-main .file-navigation') as HTMLElement
    if (!$navi) {
      $navi = document.getElementById('blob-more-options-details') as HTMLElement
      if (!$navi)  {
        $navi = document.querySelector('[data-testid="tree-overflow-menu-anchor"]') as HTMLElement
        if (!$navi) return
      }
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
    const isRoot = utils.isRepoRootDir()
    downloadBtn.className = `btn d-none d-md-block ${isRoot ? 'ml-2' : ''}`
    downloadBtn.target = '_blank'
    let url = ''
    if (isRoot) {
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
    .react-directory-filename-column { position: relative; }
    .react-directory-filename-column:after,
    .Box .Box-row > [role="gridcell"]:first-child:after {
      position: absolute;
      left: 20px;
      top: 10px;
      opacity: 0.6;
      pointer-events: none;
      content: '↓';
      font-size: 0.8em;
    }
    .react-directory-filename-column svg {
      cursor: pointer;
    }
    .react-directory-filename-column:after {
      left: 4px;
      top: 12px;
      color: white;
    }
    [data-color-mode="light"] .react-directory-filename-column:after {
      color: black;
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
      debugger
      // @ts-ignore
      const target = (e.target && e.target.ownerSVGElement || e.target) as HTMLElement
      if (!target || (target.tagName || '').toLowerCase() !== 'svg') return
      const label = target.getAttribute('aria-label') || ''
      let url: string | undefined = ''
      let isFile = false
      
      if (['Directory', 'File'].includes(label)) {
        url = target.parentElement?.nextElementSibling?.querySelector?.('a')?.href
        isFile = label === 'File'
      } else if (target.parentElement?.classList.contains('react-directory-filename-column')) {
        url = target.nextElementSibling?.querySelector?.('a')?.href
        console.warn("url", url)
        isFile = target.classList.contains('color-fg-muted')
      } else {
        return
      }
      if (!url) return
      utils.openLink(utils.getGithubDownloadUrl(url, isFile))
    }, {
      capture: true,
    })
  }
})()
