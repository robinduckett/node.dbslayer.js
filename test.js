/*
---
name: tools.js

description: <
  This is a demonstration of how dbslayer.js can be used.
  It takes three parameters from the SQL query, a host

author: [Guillermo Rauch](http://devthought.com)
updaters: [Robin Duckett](http://www.twitter.com/robinduckett)
...
*/

var sys = require('sys')
    dbslayer = require('./dbslayer'),    
    sql = process.ARGV[2],
    db = new dbslayer.Server();
    
if (!sql){
  sys.puts('Please provide the SQL query');
  return;
}

db.addListener('result', function(result) {
  sys.puts('-------------------------');
  for (var i = 0, l = result.ROWS.length; i < l; i++){
    sys.puts('Row ' + i + ': ' + result.ROWS[i].join(' '));
  }
});

db.addListener('error', function(error, errno) {
  sys.puts('-------------------------');
  sys.puts('MySQL error (' + (errno || '') + '): ' + error);
});

db.query(sql);

['stat', 'client_info', 'host_info', 'server_version', 'client_version'].forEach(function(command) {
  db.addListener(command, function(result) {
    sys.puts('-------------------------');
    sys.puts(command.toUpperCase() + ' ' + result);
  });
  db[command]();
});

