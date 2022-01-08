const html2text = require('html-to-text');
const fx = require('./src/functions.js');

async function getPageContent(url, browser) {
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

  if (browser !== undefined) browser.close();

  return {
    title: title,
    text: text,
  }
}

function transformUrl(url){
  if(url.includes('http'))
    return "https://" + url.split('/').slice(3).join('/')
  if(url.includes('.notion.site')){
    if (url[0] === '/') url = url.substring(1)
    return "https://" + url
  }
  // fallback
  return url
}

module.exports = {
  getPageContent: getPageContent,
  transformUrl: transformUrl,
}
