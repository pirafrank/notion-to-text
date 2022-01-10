const n2t = require('notion-to-text-core')
const puppeteer = require('puppeteer');
const log = require('./logger.js')

async function fetchContent(url) {
  const browser = await puppeteer.launch({headless: true});
  return n2t.getPageContent(url, browser)
}

function run(url) {
  // normalize URL
  fetchContent(url)
    .then(r => log.info(r.text)) // print to terminal
    .catch(e => log.error("Error", e))
}

module.exports = {
  run: run,
}
