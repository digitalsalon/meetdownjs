/*
 * Middleware
 */

exports.collect = function (req, res, next) {
  req.app.settings.db.collection('users', function (error, users) {
    if (error) { return new Error(error); }
    req.users = users;
    next();
  });
};

exports.findOne = function (req, res, next) {
  var user, user_id;
  user_id = req.params.id || req.session.user;
  user = req.users.findOne({ _id: user_id }, function (error, user) {
    if (!user) { throw new Error('User not found'); }
    req.user = user;
    next();
  });
};

exports.checkAuth = function(req, res, next) {
    if (!req.session.user_id) {
          res.send('You are not authorized to view this page');
    } else {
        next();
    }
};

/*
 * Endware
 */

exports.index = function (req, res) {
  var format, callback;
  format = req.params.format;
  if (format === 'json') {
    callback = function (error, found) {
      res.send(found);
    };
  } else if (!format) {
    callback = function (error, found) {
      res.render('users', {
        title: 'Users',
        users: found
      });
    };
  } else {
    throw new Error("Unsupported format");
  }

  req.app.settings.db.collection('users', function (error, users) {
    if (!error) {
      users.find().toArray(callback);
    }
  });
};

exports.authenticate = function(req, res, next) {
   var post = req.body;
   if (post.username == 'walter' && post.password == 'walterpassword') {
     req.session.user_id = 1588;
     res.redirect('/');
   } else {
     res.send('Bad user/pass');
  }
};


