function(){
  //Long-running work here
  function makeRequest (opts) {
      var xhr = new XMLHttpRequest();
      var params = opts.params, strParams;
      if (params && typeof params === 'object') {
          strParams = Object.keys(params).map(function (key) {
              return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
          }).join('&');
      }
      xhr.open(opts.method || 'GET', opts.url + "?" + strParams, false);
      if (opts.headers) {
          Object.keys(opts.headers).forEach(function (key) {
              xhr.setRequestHeader(key, opts.headers[key]);
          });
      }
      xhr.send();
      if(xhr.status == 200) return xhr.response;
      return { status: xhr.status, statusText: xhr.statusText };
  }
  onmessage = function(e){
      // e.data
      var inputData = e.data;
      
      var toBreak = false;
      var branchTry = inputData.branchTry,
          pathTry = inputData.pathTry,
          params = inputData.params,
          pathTryQueue = pathTry.split('/');   // case: ["2.1", "Examples", "Evaluation", "UWPImageRecognition", "ImageRecognizerLib"]

      if(pathTryQueue[pathTryQueue.length-1] == "") pathTryQueue.pop();
      var results = {};
      while(!toBreak){ // case: release, release/2.1
          params["ref"] = branchTry;
          
          var res = makeRequest({
              url: inputData.baseUrl + pathTry,
              params: params
          });

          if(res.status){
              if(pathTryQueue.length){
                  branchTry += "/" + pathTryQueue.shift();
                  pathTry = pathTryQueue.join('/');
                  // case: 2.1/Examples/Evaluation/UWPImageRecognition/ImageRecognizerLib, Examples/Evaluation/UWPImageRecognition/ImageRecognizerLib
              }else toBreak = true;
          }else{
              results.branch = branchTry;
              results.path = pathTry;
              toBreak = true;
          }
      }
      if(results.branch) postMessage(results);
      else postMessage(null);
      close();
  };
}