node.dbslayer.js
=================

node.dbslayer.js is a very basic and easy-to-use library to connect to a DBSlayer server, which effectively provides non-blocking and scalable MySQL support for Node.JS.

DBSlayer benefits include:

* It's Node.JS/V8/JavaScript friendly, since the the messages are delivered in JSON format over HTTP.

* Developed by the New York Times, it's designed with scalability in mind, doing connection pooling for you. This is what makes DBSlayer arguably better than implementing an async MySQL client directly into Node (through mysac for example).

Requirements
------------

* [Node.js](http://nodejs.org/) (tested with v0.1.90)
* [DBSlayer](http://code.nytimes.com/projects/dbslayer/) (tested with beta-12)

How to Install ![New!](http://i.imgur.com/XSqxQs.jpg)
--------------

From your npm equipped command line:

    npm install dbslayer

How to Use
----------

From your node.js script, require the `dbslayer` package

    var db = require('dbslayer');

Initialize a connection

    var connection = db.Server('localhost', 9090);

and then perform a query:

    connection.query("SELECT * FROM table");

To be truly non-blocking, you must use listeners. This means that in order to be able to perform queries in a designated order or access the result, you'll have to use callbacks:

    connection.query("SELECT * FROM TABLE");
    connection.on('result', function(result) {
      for (var i = 0, l = result.ROWS.length; i < l; i++){
        var row = result.ROWS[i];
        // do something with the data
      }

      connection.removeListener('result', arguments.callee);
    });

You **must** remember to remove your listener, otherwise it will be called along with any new listeners you create.

If you want to capture MySQL errors, subscribe to the 'error' event

    connection.query("SELECT * FROM inexistent_table")
    connection.on('error', function(error, errno){
      sys.puts('mysql error! + ' error);
    });

Aside from query, the commands `stat`, `client_info`, `host_info`, `server_version` and `client_version` are available, which provide the respective information about the server. In order to preserve somewhat backwards compatibility, these have seperate events per function.

More Examples
-------------

    mysql.on('result', function(result) {
      this.fetch_object(result, function(obj) {
        node.log(obj.Field);
      });
    }).query('DESCRIBE `stock`;');

You can use the fetch_object, fetch_array or fetch_args functions as shorthand to return either an object, an array or function callback arguments to retrieve your data.

    mysql.on('result', function(result) {
      this.fetch_array(result, function(arr) {
        node.log(arr[0]);
      });
    }).query('DESCRIBE `stock`;');

Or

    mysql.on('result', function(result) {
      this.fetch_args(result, function(field, type) {
        node.log(field);
      });
    }).query('DESCRIBE `stock`;');

Will produce the same output as the first example.

Installing DBSlayer
-------------------

Compile it according to the instructions [here](http://code.nytimes.com/projects/dbslayer/wiki).

Then create a /etc/dbslayer.conf file defining a database. Here I'm defining the `cool` server which connects to my `mysql` database

    [cool]
    database=mysql
    host=localhost
    user=root
    pass=1234

Then run DBSlayer for that connection:

    dbslayer -c /etc/dbslayer.conf -s cool

Test it by running test.js like this:

    node test.js "SELECT * FROM help_category"

If you get a bunch of entries like in this [screenshot](http://cld.ly/9aosh) then dbslayer (and node.dbslayer.js) work!

Authors
-------

Guillermo Rauch <[http://devthought.com](http://devthought.com)>

Robin Duckett <[http://www.twitter.com/robinduckett](http://www.twitter.com/robinduckett)>

Barry Ezell <[http://twitter.com/barryezl](http://twitter.com/barryezl)>

Contributors
------------

Craig Condon <[http://spiceapps.com](http://spiceapps.com)>