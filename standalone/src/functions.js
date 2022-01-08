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
 * Normalize a *.notion.site URL
 * @param {string} url
 * @returns {string} the normalized URL
 */
 function normalizeURL(url){
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
  writeToFile: writeToFile,
  normalizeURL: normalizeURL,
}
