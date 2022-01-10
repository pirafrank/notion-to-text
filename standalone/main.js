#!/usr/bin/env node

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const n2t = require('notion-to-text-core');
const server = require('./src/server');
const cli = require('./src/cli');
const defaults = require('./defaults');
const log = require('./src/logger')

// parse input args
const argv = yargs(hideBin(process.argv))
  .command({
    command: defaults.serveAliases,
    describe: 'start the server',
    builder: {
      port: {
        describe: 'port the server listens on',
        demandOption: false,
        type: 'number'
      },
      host: {
        describe: 'address the server binds to',
        demandOption: false,
        type: 'string'
      },
    },
    // handler function to run
    handler(agv) {
      //console.log(agv.port)
    }
  })
  .example('$0 <url>', 'notion.site URL to get content from')
  .example('$0 serve', 'start the server on default port (3000)')
  .example('$0 serve --port 3001', 'start the server on port 3001')
  .demandCommand(1)
  .argv

// script body //

log.debug(argv)

if(argv._ && argv._.length > 0){
  let firstArgument = argv._[0]
  if(defaults.serveAliases.includes(firstArgument)){
    // start the server
    let serverHost = argv.host ? argv.host : defaults.host
    let serverPort = argv.port ? argv.port : defaults.port
    log.info("Starting server...");
    server.start(serverHost, serverPort);
  } else {
    // check user input
    try {
      n2t.checkURL(firstArgument);
    } catch (err) {
      log.error(err.message);
      process.exit(4);
    }
    // try parsing the content
    try {
      log.debug("Parse the content for url", firstArgument)
      cli.run(firstArgument);
    } catch (err) {
      log.error(err.message);
      process.exit(1);
    }
  }
}
