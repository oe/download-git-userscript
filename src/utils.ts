  /**
   * is gist website
   */
export function isGist() {
  return location.hostname === 'gist.github.com'
}

export function isRepo() {
  if (!document.querySelector('.repository-content')) return false
  const meta = document.querySelector('meta[name="selected-link"]') as HTMLMetaElement
  if (meta && meta.getAttribute('value') === 'repo_commits') return false
  return true
}

export function isPrivateRepo() {
  const label = document.querySelector('#js-repo-pjax-container .hide-full-screen .Label')
  return label && label.textContent === 'Private'
}

export function isRepoRootDir() {
  return !!document.querySelector('.repository-content  get-repo')
}

export function isTextBasedSinglePage() {
  if (!getRawBtn()) return
  if (document.getElementById('readme')) return true
  const boxBody = document.querySelector('table.highlight')
  if (boxBody) return true
  return false
}

export function getUrlTextResponse(url: string): Promise<string> {
  // https://github.com/oe/search/raw/gh-pages/app-icon-retina.f492fc13.png
  // https://cdn.jsdelivr.net/gh/oe/search@gh-pages/app-icon-retina.f492fc13.png
  // https://github.com/oe/search/raw/master/CNAME
  let apiUrl = url
    .replace('github.com/', 'cdn.jsdelivr.net/gh/')
    .replace('/raw/', '@')
  return new Promise((resolve, reject) => {
    // @ts-ignore
    GM_xmlhttpRequest({
      url: apiUrl,
      method: 'GET',
      onload: (s: any) => {
        resolve(s.responseText)
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
