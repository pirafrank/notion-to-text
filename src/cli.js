const n2t = require('./notionToText.js')
const log = require('./logger.js')
const fs = require('fs');

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

function main() {
  let url = process.argv[2];
  if (!url) {
    throw new Error("Please provide a URL as the first argument");
  }
  if (!url.includes('http')){
    log.error("URL misses protocol, going with HTTPS");
    url = "https://" + url;
  }
  n2t.getTextContent(url)
    .then(r => {
      writeToFile("output.txt", r.text)
    })
    .then(r => {
      log.info("Done")
    })
    .catch(e => log.error("Error", e))
}

main()
