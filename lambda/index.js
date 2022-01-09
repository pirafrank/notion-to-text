const chromium = require('chrome-aws-lambda');
const n2t = require("notion-to-text-core");

const supportedTypes = ['text', 'raw', 'json'];

async function run(url) {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: chromium.headless,
  });
  return n2t.getPageContent(url, browser)
}

function isNotionSite(s){
  return s.includes("notion.site");
}

function getSupportedType(s){
  if(supportedTypes.includes(s))
    return s;
  else
    return null;
}

exports.handler =  function(event, context, callback) {
  // check first pathParameter
  if(!event.pathParameters || !event.pathParameters.op1
    || typeof event.pathParameters.op1 !== 'string'
    || event.pathParameters.length === 0
  ){
    callback(null, 404);
  }

  // first path param is ok, need to understand if it's supported
  // or if it's implicit, or throw bad request
  let firstParam = event.pathParameters.op1.toLowerCase();
  let type = getSupportedType(firstParam);
  if(isNotionSite(firstParam)){
    // if type is not specified default to text/plain response
    type = 'text';
  } else if(type){
    // response will have the choosen type
    type = getSupportedType(firstParam);
  } else {
    // unknown, throw bad request
    callback(null, 400);
  }

  // this is the full path of the request made to lambda endpoint,
  // hostname is not included.
  let url = event.rawPath;
  // generate notion.site URL
  if (url[0] === '/') url = url.substring(1)
  url = "https://" + url
  
  try {
    // check if this is a URL worth the effort
    n2t.checkURL(url);
  } catch (err) {
    callback(null, 400);
  }

  run(url)
    .then(r => {
      if(type === 'text' || type === 'raw'){
        // plain text response
        callback(null, {
          statusCode: 200,
          headers: {
            "content-type": "text/plain"
          },
          body: r.text
        })
      } else {
        // json response
        callback(null, {
          statusCode: 200,
          headers: {
            "content-type": "application/json"
          },
          body: r
        })
      }
    })
    .catch(e => callback(Error(e)))
}
