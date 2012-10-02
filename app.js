/*jshint laxcomma:true */
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongo = require('mongodb')
  , hbs = require('hbs')
  , moment = require('moment')
  , routes = require('./routes')
  , users = require('./routes/users')
  , events = require('./routes/events')
  , auth = require('./lib/auth');

var app = express();

app.configure(function () {
  var db = mongo.Db('test', mongo.Server('localhost', 27017, {}), {});
  db.open(function () {});
  app.set('db', db);
});

app.configure('development', function () {
  app.use(auth.configuration(__dirname + '/settings_testing', {
    debug: true,
    saveUser: function (githubUserMetadata) {
      // TODO: save to database???
      console.log(githubUserMetadata.email);
    }
  }));
});

// Configuration
app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "SUPERSECRETKEY" }));
  app.use(auth.middleware());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

hbs.registerHelper('date', function (format, date) {
  return date ? moment(date).format(format) : '';
});

// Routes

app.get('/',
  events.listUpcoming,
  routes.index
);
app.post('/my/events',
  users.findOne,
  events.findOne,
  events.update
);
app.get('/events/create',
  events.create
);
app.get('/events',
  events.list
);
app.post('/events',
  events.dateify,
  events.collect,
  events.save
);

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
