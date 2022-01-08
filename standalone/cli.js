#!/usr/bin/env node

const n2t = require('notion-to-text-core')
const fs = require('fs');
const puppeteer = require('puppeteer');
const log = require('../core/src/logger.js')

function writeToFile(filename, data){
  // delete output file if it exists
  if(fs.existsSync(filename))
    fs.unlinkSync(filename)
  // write converted output to file
  fs.writeFileSync(
    filename,
    data,
    ((err) => {
      if(err) return log.error(err);
      log.info("Data written to file")
    })
  )
}

async function run(url) {
  const browser = await puppeteer.launch({headless: true});
  return n2t.getPageContent(url, browser)
}

function main() {
  let url = process.argv[2];
  if (!url) {
    throw new Error("Please provide a URL as the first argument");
  }
  if (!url.includes('http')){
    log.error("URL misses protocol, going with HTTPS");
    url = "https://" + url;
  }

  run(url)
    .then(r => log.info(r.text))
    .catch(e => log.error("Error", e))
}

main()
