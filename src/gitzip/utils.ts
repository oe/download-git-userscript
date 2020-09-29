export interface IResolvedURL {
  /** The project owner */
  author: string
  /** The project name */
  project: string
  /** The default branch or other branches */
  branch: string
  /** The type of url link, values: tree, blob, link? */
  type: string
  /** The path of target file/dir based on root repo url. */
  path: string
  /** The input url */
  inputUrl: string
  /** The root dir url */
  rootUrl: string
}

export const REPO_EXP = new RegExp("^https://github.com/([^/]+)/([^/]+)(/(tree|blob)/([^/]+)(/(.*))?)?")
export const GITHUB_PROVIDED_URL = new RegExp("^https://api.github.com/.*")
export const GITHUB_DOWNLOAD_URL = new RegExp("^https://raw.githubusercontent.com/.*")

export function removeTailSlash (str: string) {
  return str && str.replace(/\/$/, '')
}

/** resolve github repo url */
export function resolveUrl(repoUrl): IResolvedURL {
  if(typeof repoUrl != 'string') return;
  var matches = repoUrl.match(REPO_EXP);
  if(matches && matches.length > 0){
      var root = (matches[5])? 
          "https://github.com/" + matches[1] + "/" + matches[2] + "/tree/" + matches[5] :
          repoUrl;
      return {
          author: matches[1],
          project: matches[2],
          branch: matches[5] || 'master',
          type: matches[4] || '',
          path: removeTailSlash(matches[7] || ''),
          inputUrl: repoUrl,
          rootUrl: root
      }
  }
}

export interface IRequestOptions {
  method?: 'GET' | 'POST' | 'HEAD'
  url: string
  headers?: object
  contentType?: string
  responseType?: 'arraybuffer' | 'blob' | 'json'
  data?: object | string
  /** in ms */
  timeout?: number
  query?: string | object 
}

export interface IRequestResponse {
  /**  - the final URL after all redirects from where the data was loaded */
  finalUrl: string
  /**  - the ready state */
  readyState:  0 | 1 | 2 | 3 | 4 
  /**  - the request status */
  status: number
  /**  - the request status text */
  statusText: string
  /**  - the request response headers */
  responseHeaders: object
  /**  - the response data as object if details.responseType was set */
  response: object
  /**  - the response data as XML document */
  responseXML: Document | null
  /**  - the response data as plain string */
  responseText: string
}

export function serializeObject2query(obj: object) {
  return Object.keys(obj).map(key => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
  }).join('&')
}

export function request(params: IRequestOptions): Promise<IRequestResponse> {
  const contentTypeMap = {
    form: 'application/x-www-form-urlencoded',
    json: 'application/json',
  }
  const defaultParams = {
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded'
  }
  const mergedParams = Object.assign({}, defaultParams, params)
  mergedParams.contentType = contentTypeMap[mergedParams.contentType] || mergedParams.contentType
  
  let query = mergedParams.query
  if (typeof query === 'object') {
    query = serializeObject2query(query)
  }

  if (query) {
    mergedParams.url += mergedParams.url.includes('?') ? '&' : '?' + query
  }

  if (typeof mergedParams.data === 'object') {
    mergedParams.data = contentTypeMap.json === mergedParams.contentType ?
      JSON.stringify(mergedParams.data) :
      serializeObject2query(mergedParams.data)
  }
  mergedParams.headers = Object.assign(mergedParams.headers || {}, { 'content-type': mergedParams.contentType })

  
  return new Promise((resolve, reject) => {
    // @ts-ignore
    GM_xmlhttpRequest({
      method: mergedParams.method,
      url: mergedParams.url,
      ontimeout: reject,
      data: mergedParams.data,
      onabort: reject,
      onerror: reject,
      onload: (res: IRequestResponse) => {
        if (res.readyState === 4 && res.status === 200) {
          resolve(res)
        } else {
          reject(res)
        }
      }
    })
  })
}