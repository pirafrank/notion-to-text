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
    callback(null, {
      statusCode: 404,
      headers: {
        "content-type": "application/json"
      },
      body: null
    });
  }

  // first path param is ok, need to understand if it's supported
  // or if it's implicit, otherwise throw bad request
  let firstParam = event.pathParameters.op1.toLowerCase();
  let type = getSupportedType(firstParam);
  if(isNotionSite(firstParam)){
    // if first param is notion.site url
    // type is not specified, default to text/plain response
    type = 'text';
  } else if(type){
    // response will have the choosen type
    type = getSupportedType(firstParam);
  } else {
    // unknown type, throw bad request
    callback(null, {
      statusCode: 400,
      headers: {
        "content-type": "application/json"
      },
      body: null
    });
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
    callback(null, {
      statusCode: 400,
      headers: {
        "content-type": "application/json"
      },
      body: null
    });
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
          body: JSON.stringify(r)
        })
      }
    })
    .catch(e => callback({
      statusCode: 500,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(e)
    }))
}
