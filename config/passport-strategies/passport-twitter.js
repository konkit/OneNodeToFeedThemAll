module.exports = function(passport) {
  var TwitterStrategy  = require('passport-twitter').Strategy;
  var configAuth = require('../auth');

  passport.use(new TwitterStrategy({
    consumerKey     : configAuth.twitterAuth.consumerKey,
    consumerSecret  : configAuth.twitterAuth.consumerSecret,
    callbackURL     : configAuth.twitterAuth.callbackURL,
    passReqToCallback : true
  },
  function(req, token, tokenSecret, profile, done) {
    process.nextTick(function() {
      if (!req.user) {
        User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
          if (err) {
            return done(err);
          }

          if (user) {
            user.fillTwitterData(profile, token, tokenSecret).then(function(user) {
              return done(null, user);
            });
          } else {
            User.createTwitterUser(profile, token, tokenSecret).then(function(user) {
              return done(null, user);
            });
          }
        });
      } else {
        req.user.linkWithTwitter(profile, token, tokenSecret).then(function(user) {
          return done(null, user);
        });
      }
    });
  }));
}
