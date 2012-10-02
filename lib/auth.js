var everyauth = require('everyauth');

exports.configuration = function (settingPath, conf) {
  settings = require(settingPath);
  everyauth.debug = conf.debug !== undefined ? conf.debug : false;
  everyauth.github
    .appId(settings.GITHUB_OAUTH2_ID)
    .appSecret(settings.GITHUB_OAUTH2_SECRET)
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, githubUserMetadata) {
        conf.saveUser(githubUserMetadata);
        return { email: githubUserMetadata.email };
    }).redirectPath('/');
  return function (req, res, next) {
      next();
  };
};

exports.middleware = function () {
    return everyauth.middleware();
};
