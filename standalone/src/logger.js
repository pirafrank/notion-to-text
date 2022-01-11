const log = require('loglevel');
const { formatDate } = require('./utils');

const swapKeyValues = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]))

const logLevelsMap = (swapKeyValues(log.levels));

// configure logger
const originalFactory = log.methodFactory;
log.methodFactory = function (methodName, logLevel, loggerName) {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);
  return function (message) {
    rawMethod(logLevelsMap[logLevel] + " " + formatDate(new Date()) + " " + message);
  };
};

// set default log level
if(process.env.DEBUG_ENABLED)
  log.setLevel('debug');
else
  log.setLevel('info');

log.warn("aaaaaaaaaa")

module.exports = {
  log: log,
  logLevelsMap: logLevelsMap,
}
