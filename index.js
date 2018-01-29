const fastify = require('fastify')();
const path    = require('path');
const fetch   = require('node-fetch');

const PORT   = process.env.PORT || 3000;
const WEBDIS = "http://35.196.211.117";

let saveCapturedData = function (capturedData) {
  return fetch(`${WEBDIS}/LPUSH/browser-captured-data/${encodeURIComponent(capturedData)}`);
}

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/'
})

fastify.get('/', function (request, reply) {
  reply.sendFile('index.html');
})

fastify.post('/capture', function (request, reply) {
  saveCapturedData(JSON.stringify(request.body)).then(function() {
    reply.code(200);
    reply.send();

  }).catch(function() {
    reply.code(500);
    reply.send();
  });
})

fastify.listen(PORT, '0.0.0.0', function (err) {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`);
})