/*jshint laxcomma:true */
/**
 * Module dependencies.
 */

var express = require('express')
  , mongo = require('mongodb')
  , hbs = require('hbs')
  , moment = require('moment')
  , routes = require('./routes')
  , users = require('./routes/users')
  , events = require('./routes/events')
  , auth = require('./lib/auth');

var app = module.exports = express.createServer();

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
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "SUPERSECRETKEY" }));
  app.use(auth.middleware());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

hbs.registerHelper('date', function (format, date) {
  return date ? moment(date).format(format) : '';
});

// Routes

app.get('/',
  function (req, res, next) {
    console.log(req.session);
    next();
  },
  events.listUpcoming,
  routes.index
);
app.all('/auth/github/callback',
  function (request, response) {
    console.log("Got here");
  }
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

app.listen(3000, function () {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
