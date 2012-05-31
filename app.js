
/**
 * Module dependencies.
 */

var express = require('express')
  , mongo = require('mongodb')
  , hbs = require('hbs')
  , moment = require('moment')
  , routes = require('./routes')
  , users = require('./routes/users')
  , events = require('./routes/events');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "SUPERSECRETKEY" }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.configure(function() {
  var db = new mongo.Db('test', new mongo.Server('localhost', 27017, {}), {});
  db.open(function() {});
  app.set('db', db);
});

hbs.registerHelper('date', function (format, date) {
  return date ? moment(date).format(format) : '';
});

// Routes

app.get('/',
  events.collect,
  events.listUpcoming,
  events.markup,
  routes.index
);
app.post('/login',
    users.authenticate
);
app.post('/my/events',
  users.collect,
  users.findOne,
  events.collect,
  events.findOne,
  events.update
);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
