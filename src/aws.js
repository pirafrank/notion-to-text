const html2text = require('html-to-text');
const chromium = require('chrome-aws-lambda');
const fx = require('./functions.js');

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

  await page.waitForSelector('.notion-page-content', { timeout: 1000 });

  const pageContent = await page.evaluate(() => {
    return document.querySelector('.notion-page-content').innerHTML;
  });

  // covert downloaded html to text
  const text = html2text.convert(pageContent, {
    wordwrap: 80,
    formatters: {
      formatLinks: fx.formatAnchor,
    },
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
      callback(null, {
        statusCode: 200,
        headers: {
          "content-type": "text/html"
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
