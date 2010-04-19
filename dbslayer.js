/*
---
name: dbslayer.js

description: Interface to DBSlayer for Node.JS

author: [Guillermo Rauch](http://devthought.com)
updaters: [Robin Duckett](http://www.twitter.com/robinduckett)
...
*/

var sys = require('sys'),
    http = require('http'),
    events = require('events'),
    booleanCommands = ['STAT', 'CLIENT_INFO', 'HOST_INFO', 'SERVER_VERSION', 'CLIENT_VERSION'];

var Server = function(host, port, timeout) {
  this.host = host || 'localhost';
  this.port = port || 9090;
  this.timeout = timeout;
};

sys.inherits(Server, events.EventEmitter);

Server.prototype.fetch = function(object, key) {
  
  var connection = http.createClient(this.port, this.host);
  var request = connection.request('GET', '/db?' + escape(JSON.stringify(object)), {'host': this.host});
  var server = this;

  request.addListener('response', function(response) {
    response.setEncoding('utf8');
    response.addListener('data', function(data) {
      try {
        var object = JSON.parse(data);
      } catch(e) {
        server.emit('error', e);
      }

      if (object.MYSQL_ERROR !== undefined) {
        thiso.emit('error', object.MYSQL_ERROR, object.MYSQL_ERRNO);
      } else if (object.ERROR !== undefined) {
        server.emit('error', object.ERROR);
      } else {
        server.emit(key.toLowerCase(), key ? object[key] : object);
      }
    });
  });

  request.end();
};

Server.prototype.query = function(query){
  return this.fetch({SQL: query}, 'RESULT');
};

for (var i = 0, l = booleanCommands.length; i < l; i++){
  Server.prototype[booleanCommands[i].toLowerCase()] = (function(command){
    return function(){
      var obj = {};
      obj[command] = true;
      return this.fetch(obj, command);
    };
  })(booleanCommands[i]);
}

exports.Server = Server;
