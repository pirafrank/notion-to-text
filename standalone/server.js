const n2t = require('notion-to-text-core')
const fastify = require('fastify')({
  logger: true
})
const log = require('./logger')

fastify.get('/:type/*', (request, reply) => {
  log.debug(request.url)
  const type = request.params.type
  if(type !== 'text' && type !== 'json'){
    reply.code(404)
    reply.send()
    return;
  }

  let url = n2t.transformUrl(request.url.split('/').slice(2).join('/'))
  log.debug("Transformed url is: " + url)

  reply.type("application/json")  // default to json
  n2t.getPageContent(url)
    .then(response => {
      reply.code(200)
      if(type === 'text'){
        reply.type("text/plain")
        reply.send(response.text)
      } else {
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
fastify.listen(3000, (err, address) => {
  if (err) throw err
  log.info("Server is now listening on " + address);
})
