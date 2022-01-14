const n2t = require('notion-to-text-core')
const puppeteer = require('puppeteer');
const fastify = require('fastify')({
  logger: true
})
const fx = require('./functions')
const log = require('./logger')


const supportedTypes = ['text', 'raw', 'json'];

const start = function(host, port){

  fastify.get('/:type/*', (request, reply) => {
    log.debug(request.url)
    const type = request.params.type
    if(!supportedTypes.includes(type)){
      reply.code(404)
      reply.send()
      return;
    }

    let url;
    try{
      url = fx.normalizeURL(request.url);
      n2t.checkURL(url);
    } catch (err) {
      reply.type("application/json");
      reply.send({ error: err.message });
      return;
    }

    log.debug("Transformed url is: " + url)

    puppeteer.launch({headless: true})
      .then(browser => {
        return n2t.getPageContent(url, browser)
      })
      .then(response => {
        reply.code(200)
        if(type === 'text' || type === 'raw'){
          reply.type("text/plain")
          reply.send(response.title + '\n\n' + response.text)
        } else {
          reply.type("application/json")
          reply.send(response)
        }
      })
      .catch(e => {
        log.error("Error", e)
        reply.code(500)
        reply.send({ error: e})
      })
  })

  // run the server
  fastify.listen(port, host, (err, address) => {
    if (err) throw err
    log.info("Server is now listening on " + address);
  })

}

module.exports = {
  start: start,
}
