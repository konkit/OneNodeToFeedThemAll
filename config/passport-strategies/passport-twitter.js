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
            if (!user.twitter.token) {
              user.twitter.token       = token;
              user.twitter.tokenSecret = tokenSecret;
              user.twitter.username    = profile.username;
              user.twitter.displayName = profile.displayName;

              user.save(function(err) {
                if (err) {
                  throw err;
                }
                return done(null, user);
              });
            }
            return done(null, user);
          } else {
            var newUser                 = new User();

            newUser.twitter.id          = profile.id;
            newUser.twitter.token       = token;
            newUser.twitter.tokenSecret = tokenSecret;
            newUser.twitter.username    = profile.username;
            newUser.twitter.displayName = profile.displayName;

            newUser.save(function(err) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
      } else {
        var user                 = req.user;
        user.twitter.id          = profile.id;
        user.twitter.token       = token;
        user.twitter.tokenSecret = tokenSecret;
        user.twitter.username    = profile.username;
        user.twitter.displayName = profile.displayName;

        user.save(function(err) {
          if (err) {
            throw err;
          }
          return done(null, user);
        });
      }
    });
  }));
}