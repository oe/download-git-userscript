import * as utils from './utils'

(function () {
  const DOWNLOAD_BTN_ID = 'xiu-download-btn'
  const STYLE_ELEMENT_ID = 'xiu-style-element'
  let tid = 0
  main()

  console.log('xiu-download: init')
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
    let $navi = utils.isRepoRootDir() && document.querySelector('#branch-picker-repos-header-ref-selector') as HTMLElement
    if ($navi) {
      $navi = $navi.parentElement!.parentElement!.nextElementSibling as HTMLElement
    } else {
      $navi = document.querySelector('#StickyHeader .js-github-dev-new-tab-shortcut') as HTMLElement
      if (!$navi)  {
        $navi = document.querySelector('[data-testid="tree-overflow-menu-anchor"]') as HTMLElement
        if (!$navi) return
      }
      $navi = $navi.parentElement as HTMLElement
    }
    if (!$navi) return
    const downloadBtn = getDownloadBtn()
    if (!downloadBtn || $navi.contains(downloadBtn)) return
    $navi.appendChild(downloadBtn)
  }

  function getDownloadBtn() {
    let downloadBtn = document.getElementById(DOWNLOAD_BTN_ID) as HTMLAnchorElement | null
    if (!downloadBtn) {
      downloadBtn = document.createElement('a')
      downloadBtn.id = DOWNLOAD_BTN_ID
    }
    const isRoot = utils.isRepoRootDir()
    downloadBtn.className = `btn d-none d-md-block ${isRoot ? 'ml-0' : ''}`
    downloadBtn.target = '_blank'
    let url = ''
    if (isRoot) {
      try {
        // @ts-ignore
        const repoInfo = JSON.parse(document.querySelector('[partial-name="repos-overview"] [data-target="react-partial.embeddedData"]')!.innerText)
        const zipUrl = repoInfo.props.initialPayload.overview.codeButton.local.platformInfo.zipballUrl
        url = new URL(zipUrl, location.href).href
      } catch (error) {
        console.warn('unable to get zip url', error)
        return
      }
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
    .react-directory-filename-column:has(a[aria-label*="File"]):after,
    .react-directory-filename-column:has(a[aria-label*="Directory"]):after,
    .Box .Box-row > [role="gridcell"]:first-child:after {
      position: absolute;
      left: 20px;
      top: 10px;
      opacity: 0.6;
      pointer-events: none;
      content: '↓';
      font-size: 0.8em;
      z-index: 11;
    }

    .react-directory-filename-column:has(a[aria-label*="File"]):after,
    .react-directory-filename-column:has(a[aria-label*="Directory"]):after{
      left: 4px;
      top: 12px;
      color: white;
    }


    [data-color-mode="light"] .react-directory-filename-column:after {
      color: black;
    }
    @media (prefers-color-scheme: light) {
      [data-color-mode=auto][data-light-theme*=light] .react-directory-filename-column:after {
        color: black;
      }
    }

    .react-directory-filename-column:has(a[aria-label*="File"]) svg,
    .react-directory-filename-column:has(a[aria-label*="Directory"]) svg{
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
      let url: string | undefined = ''
      let isFile = false
      
      if (['Directory', 'File'].includes(label)) {
        url = target.parentElement?.nextElementSibling?.querySelector?.('a')?.href
        isFile = label === 'File'
      } else if (target.parentElement?.classList.contains('react-directory-filename-column')) {
        const anchor = target.nextElementSibling?.querySelector?.('a')
        if (!anchor) return
        const label = anchor.getAttribute('aria-label') || ''
        if (!label.includes('Directory') && !label.includes('File')) return
        url = anchor.href
        console.warn("url", url)
        isFile = target.classList.contains('color-fg-muted')
      } else {
        return
      }
      if (!url) return
      utils.openLink(utils.getGithubDownloadUrl(url, isFile))
    }, {
      capture: true,
      passive: true,
    })
  }
})()
