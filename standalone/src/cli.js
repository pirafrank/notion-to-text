const n2t = require('notion-to-text-core')
const puppeteer = require('puppeteer');

async function fetchContent(url) {
  const browser = await puppeteer.launch({headless: true});
  return n2t.getPageContent(url, browser)
}

function run(url) {
  // normalize URL
  return fetchContent(url)
    // return whole object
    .then(r => r)
    .catch(e => ({ "error": e.message }))
}

module.exports = {
  run: run,
}
