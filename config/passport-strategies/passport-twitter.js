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

          createNewUser = function() {
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

          fillMissingToken = function() {
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

          if (user) {
            if (!user.twitter.token) {
              fillMissingToken();
            }
            return done(null, user);
          } else {
            createNewUser();
          }
        });
      } else {
        User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
          // Remove old user with this twitter data
          if( !user._id.equals(req.user._id)) {
            user.remove();
          }
        });

        // link account with twitter
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
