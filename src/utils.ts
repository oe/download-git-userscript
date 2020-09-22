  /**
   * is gist website
   */
  export function isGist() {
    return location.hostname === 'gist.github.com'
  }

  export function isRepo() {
    return document.querySelector('.repository-content')
  }

export function getFileNavi() {
  let $navi = document.querySelector('.repository-content .file-navigation')
  if (!$navi) {
    $navi = document.querySelector('#blob-more-options-details')
    if ($navi) {
      $navi = $navi.parentElement
    }
  }
  return $navi
}

export function isPrivateRepo() {
  const label = document.querySelector('#js-repo-pjax-container .hide-full-screen .Label')
  return label && label.textContent === 'Private'
}

export function isRepoRootDir() {
  const $fileNavi = getFileNavi()
  if (!$fileNavi) return false
  return !!$fileNavi.querySelector('get-repo')
}

export function isTextBasedSinglePage() {
  if (!getRawBtn()) return
  if (document.getElementById('readme')) return true
  const boxBody = document.querySelector('table.highlight')
  if (boxBody) return true
  return false
}

export function getUrlTextResponse(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      ontimeout: reject,
      onabort: reject,
      onerror: reject,
      onload: (res: any) => {
        if (res.responseText) {
          resolve(res.responseText)
        } else {
          reject(res)
        }
      }
    })
  })
}

// if is single file page, then it has a raw btn
export function getRawBtn() {
  return document.getElementById('raw-url')
}

// remove qeurystring & hash
export function getCurrentUrlPath() {
  const url = location.origin + location.pathname
  return url.replace(/\/$/, '')
}

export function openLink(url: string) {
  const link = document.createElement('a')
  link.target = '_blank'
  link.href = url
  link.click()
}
