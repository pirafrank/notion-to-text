const html2text = require('html-to-text');
const fx = require('./src/functions.js');

/**
 * Get an object with content and title of given page
 * at *.notion.site URL
 * @param {string} url notion.site URL
 * @param {Object} browser Puppeteer/chrome-aws-lambda Browser object
 * @returns {Object} { title: string, text: string }
 */
async function getPageContent(url, browser) {
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080});
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });

  await page.waitForSelector('.notion-page-content', { timeout: 1000 });

  // use page.evaluate to execute JavaScript on the page
  const pageContent = await page.evaluate(() => {
    return document.querySelector('.notion-page-content').innerHTML;
  });

  const title = await page.evaluate(() => {
    let titleParents = document.getElementsByClassName('notion-selectable notion-page-block');
    if(titleParents.length > 0){
      let firstChild = titleParents[0];
      let contents = firstChild.getElementsByTagName('div');
      if(contents.length > 0){
        return contents[0].innerText;
      }
    }
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

const isValidHttpUrl = function(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

/**
 * Check if a given URL is a valid one and belongs to notion.site
 * @param {string} url string to check
 * @returns
 */
function checkURL(url){
  if(!url)
    throw new Error("URL is null or undefined");
  if(typeof url !== 'string')
    throw new Error("URL is not a string object");
  if(url.trim().length === 0)
    throw new Error("URL is an empty string");
  if(!isValidHttpUrl(url))
    throw new Error("URL is not a valid one");
  if(!url.includes('.notion.site'))
    throw new Error("URL is not a *.notion.site one");
}

// debug only code --start
if(require.main === module && process.env.DEBUG_ENABLED){
  const puppeteer = require('puppeteer');
  puppeteer.launch({headless: true})
    .then(browser => {
      return getPageContent("https://pirafrank.notion.site", browser)
    })
    .then(response => {
      console.log(JSON.stringify(response));
    })
    .catch(e => {
      console.error("Error", e.message)
    })
}
// end

module.exports = {
  getPageContent: getPageContent,
  checkURL: checkURL,
}
