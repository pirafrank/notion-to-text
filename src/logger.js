
function pad(num, padding) {
  return (String("0".repeat(padding) + num).slice(-padding));
}

function formatDate(d) {
  return (
    d.getFullYear() + '-' +
    pad(d.getMonth() + 1, 2) + '-' +
    pad(d.getDate(), 2) + ' ' +
    pad(d.getHours(), 2) + ':' +
    pad(d.getMinutes(), 2) + ':' +
    pad(d.getSeconds(), 2) + '.' +
    pad(d.getMilliseconds(), 3)
  )
}
function info(...args){
  console.log("INFO " + formatDate(new Date()) + ' ', ...args);
}

function debug(...args){
  if(process.env.DEBUG_ENABLED)
    console.log("DEBUG " + formatDate(new Date()) + ' ', ...args);
}

function error(...args){
  console.error("INFO " + formatDate(new Date()) + ' ', ...args);
}

function warn(...args){
  console.warn("INFO " + formatDate(new Date()) + ' ', ...args);
}

module.exports = {
  info: info,
  error: error,
  warn: warn,
  debug: debug,
}
