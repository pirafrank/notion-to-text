#!/usr/bin/env node

const n2t = require('notion-to-text-core')
const puppeteer = require('puppeteer');
const log = require('./logger.js')
const fx = require('./functions')

async function fetchContent(url) {
  const browser = await puppeteer.launch({headless: true});
  return n2t.getPageContent(url, browser)
}

function run(url) {
  // normalize URL
  url = fx.normalizeURL(url);
  fetchContent(url)
    .then(r => log.info(r.text)) // print to terminal
    .catch(e => log.error("Error", e))
}

module.exports = {
  run: run,
}
