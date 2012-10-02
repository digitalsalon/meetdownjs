var md = require("github-flavored-markdown");

/*
 * Middleware
 */

exports.collect = function (req, res, next) {
  req.app.settings.db.collection('events', function (error, events) {
    if (error) { return new Error(error); }
    req.events = events;
    next();
  });
};

exports.get = function (req, res, next) {
  req.events.findOne(req.body, function (error, event) {
    if (error) { return new Error(error); }
    req.event = event;
    next();
  });
};

exports.uncollect = function (req, res, next) {
  req.events = undefined;
  next();
};

exports.findAll = function (req, res, next) {
  req.events
   .find()
   .sort({ starts_at: 1 })
   .toArray(function (error, found) {
      if (error) { return new Error(error); }
      req.found = found;
      next();
    });
};

exports.findUpcoming = function (req, res, next) {
  req.events
    .find({ starts_at: { $gt: new Date() }})
    .sort({ starts_at: 1 })
    .toArray(function (error, found) {
      if (error) { return new Error(error); }
      req.found = found;
      next();
    });
};

exports.dateify = function (req, res, next) {
  req.body.starts_at = new Date(req.body.starts_at);
  next();
};

exports.markup = function (req, res, next) {
  req.found = req.found.map(function (event) {
    event.description = event.description ?
      md.parse(event.description) :
      undefined;
    return event;
  });
  next();
};

/*
 * Endware
 */

exports.create = function (req, res) {
  res.render('event_form');
};

exports.save = function (req, res) {
  req.events.save(req.body, function (error, docs) {
    if (error) { throw new Error(error); }
    else { res.send(docs); }
  });
};

exports.update = function (req, res) {
  req.events.findAndModify(req.event, [], { $set: req.body }, {}, function (error, event) {
    if (error) { throw new Error(error); }
    else { res.send(event); }
  });
};

exports.index = function (req, res) {
  res.render('events', {
    title: 'Events',
    events: req.found
  });
};

/*
 * Bundles
 */

exports.listUpcoming = [
  exports.collect,
  exports.findUpcoming,
  exports.markup,
  exports.uncollect
];

exports.findOne = [
  exports.collect,
  exports.get
];

exports.list = [
  exports.collect,
  exports.findAll,
  exports.markup,
  exports.index
];
