const html2text = require('html-to-text');
const chromium = require('chrome-aws-lambda');

async function notionToText(url){
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080});
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });

  const title = await page.evaluate(() => document.title)
  const text = html2text.convert(pageContent, {
    wordwrap: 80,
    selectors: [
      { selector: 'img', format: 'skip' },
      { selector: 'a', format: 'formatLinks', options: { hideLinkHrefIfSameAsText: true, noAnchorUrl: true } }
    ],
  });

  if (browser !== null) await browser.close();

  return {
    title: title,
    text: text,
  }
}

exports.handler =  function(event, context, callback) {
  let x = { path: event.rawPath }
  let url = 'https://pirafrank.notion.site'

  notionToText(url)
    .then(r => {
      callback(null, r.text)
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
