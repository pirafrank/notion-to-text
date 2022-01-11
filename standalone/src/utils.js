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

module.exports = {
  pad: pad,
  formatDate: formatDate,
}
