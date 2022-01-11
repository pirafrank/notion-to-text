#!/usr/bin/env node

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const n2t = require('notion-to-text-core');
const server = require('./src/server');
const cli = require('./src/cli');
const defaults = require('./defaults');
const { log } = require('./src/logger')

// parse input args
const argv = yargs(hideBin(process.argv))
  .check((agv, options) => {
    const params = agv._
    const supportedCommands = ['get', 'g', 'serve', 's']
    if (params.length > 0 && supportedCommands.includes(params[0])){
      return true; // arguments are ok, pass the check
    } else {
      throw new Error(`ERROR: '${params[0]}' command is not supported.\n`);
    }
  })
  .option("d")
  .alias("d", "debug")
  .hide("d")
  .command({
    command: 'get <URL>',
    aliases: ['g'],
    desc: 'Get content from URL and print to stdout',
    builder: {},
    handler: (agv) => {
      if(agv.debug) log.setLevel('debug');
      log.debug(`'get' handler, URL is ${agv.URL}`)
      // CLI mode, get content from user given URL
      try {
        // check user input
        n2t.checkURL(agv.URL);
      } catch (err) {
        log.error(err.message);
        process.exit(4); // bad user input
      }
      // try parsing the content
      try {
        log.debug("Parse the content for URL", agv.URL)
        cli.run(agv.URL);
      } catch (err) {
        log.error(err.message);
        process.exit(1); // fetchContent error
      }
    }
  })
  .command({
    command: 'serve',
    aliases: ['s'],
    describe: 'start the server',
    builder: {
      port: {
        describe: 'port the server listens on',
        demandOption: false,
        type: 'number',
        default: defaults.port,
      },
      host: {
        describe: 'address the server binds to',
        demandOption: false,
        type: 'string',
        default: defaults.host,
      },
    },
    // handler function to run
    handler: (agv) => {
      if(agv.debug) log.setLevel('debug');
      log.debug(`'serve' handler, HOST: ${agv.host}, PORT: ${agv.port}`)
      // start the server
      let serverHost = agv.host ? agv.host : defaults.host
      let serverPort = agv.port ? agv.port : defaults.port
      log.info("Starting server...");
      server.start(serverHost, serverPort);
    }
  })
  .example('$0 get <URL>', 'get content from notion.site URL')
  .example('$0 serve', `start the server on ${defaults.host}:${defaults.port}`)
  .example('$0 serve --port 3001', 'start the server on port 3001')
  .example('$0 serve --host "192.168.0.123"', 'start the server and bind to given host')
  .nargs('get', 1)
  .demandCommand(1, "You need to provide one command at least.")
  .scriptName('ntt')
  .usage('\nntt <command> [<args>]')
  .help()
  .argv

// script body //

log.debug(JSON.stringify(argv))
