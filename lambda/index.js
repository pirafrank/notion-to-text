const chromium = require('chrome-aws-lambda');
const n2t = require("notion-to-text-core");

async function run(url) {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: chromium.headless,
  });
  return n2t.getPageContent(url, browser)
}

exports.handler =  function(event, context, callback) {
  let x = { path: event.rawPath }
  let url = 'https://pirafrank.notion.site'

  run(url)
    .then(r => {
      callback(null, {
        statusCode: 200,
        headers: {
          "content-type": "text/plain"
        },
        body: r.text
      })
    })
    .catch(e => callback(Error(e)))

  /*
  n2t.getTextContent(url)
    .then(r => {
      callback(null, r.text)
    })
    .catch(e => callback(Error(e)))
  */

  /*
  https.get(url, (res) => {
    callback(null, res.statusCode)
  }).on('error', (e) => {
    callback(Error(e))
  })
  */
}
