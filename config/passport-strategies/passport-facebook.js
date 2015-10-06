module.exports = function(passport) {
  var FacebookStrategy = require('passport-facebook').Strategy;
  var configAuth = require('../auth');

  passport.use(new FacebookStrategy({
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL,
    passReqToCallback : true
  },
  function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      if (!req.user) {
        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
          if (err) {
            return done(err);
          }

          if (user) {
            user.fillFacebookData(profile, token).then(function(user) {
              return done(null, user);
            })
          } else {
            User.createFacebookUser(profile, token).then(function(user) {
              return done(null, user);
            });
          }
        });
      } else {
        req.user.linkWithFacebook(profile, token).then(function(user) {
          return done(null, user);
        })
      }
    });
  }));
}
