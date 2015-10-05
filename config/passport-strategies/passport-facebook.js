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

          createNewUser = function() {
            var newUser            = new User();

            newUser.facebook.id    = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.email = profile.emails[0].value;

            newUser.save(function(err) {
              if (err) { throw err; }
              return done(null, newUser);
            });
          }

          fillMissingToken = function() {
            user.facebook.token = token;
            user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
            user.facebook.email = profile.emails[0].value;

            user.save(function(err) {
              if (err) { throw err; }
              return done(null, user);
            });
          }

          if (user) {
            if (!user.facebook.token) {
              fillMissingToken();
            }
            return done(null, user);
          } else {
            createNewUser();
          }
        });
      } else {
        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
          // Remove old user with this twitter data
          if( !user._id.equals(req.user._id)) {
            user.remove();
          }
        });

        // link account with facebook
        var user            = req.user;
        user.facebook.id    = profile.id;
        user.facebook.token = token;
        user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
        user.facebook.email = profile.emails[0].value;

        user.save(function(err) {
          if (err) { throw err; }
          return done(null, user);
        });
      }
    });
  }));
}
