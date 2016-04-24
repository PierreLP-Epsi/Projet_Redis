'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const path = require('path');
server.connection({
  port: 3000
});


// register plugins
server.register(require('inert'), (err) => {

});

// setup routes
server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: path.resolve(__dirname, './dist')
    }
  }
});

const entries = require('./reading.json');

server.route({
  method: 'GET',
  path: '/api/links',
  handler: function(request, reply){
    return reply(entries)
  }
});

// listen
server.start((err) => {

  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
