const fs = require('fs');
const log = require('./logger.js')

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

/**
 * Get notion.site URL from server relative URL
 * e.g. return https://some.notion.site/abc123 from /json/some.notion.site/abc123
 * @param {string} url url path in input
 * @returns {string} the normalized URL
 */
 function normalizeURL(url){
  if(url.includes('.notion.site')){
    url = url.split('/').slice(2).join('/');
    if (url[0] === '/') url = url.substring(1)
    return "https://" + url
  } else {
    throw new Error("Cannot normalizeURL");
  }
}

module.exports = {
  writeToFile: writeToFile,
  normalizeURL: normalizeURL,
}
