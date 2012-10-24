exports.index = function (req, res) {
  var next = req.found.shift();
  res.render('index', {
    title: 'Meetdown.js',
    next: next,
    upcoming: req.found,
    user_name: req.session.user_name
  });
};
