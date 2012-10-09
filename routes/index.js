var events = require("./events");

exports.index = function (req, res) {
  var next = req.found.shift();
  res.render('index', {
    title: 'Meetdown.js',
    next: next,
    upcoming: req.found
  });
};

exports.home = [
  events.listUpcoming,
  exports.index
];
