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
            if (!user.facebook.token) {
              fillMissingToken();
            }
            return done(null, user);
          } else {
            createNewUser();
          }

          function createNewUser() {
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

          function fillMissingToken() {
            user.facebook.token = token;
            user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
            user.facebook.email = profile.emails[0].value;

            user.save(function(err) {
              if (err) { throw err; }
              return done(null, user);
            });
          }

        });
      } else {
        User.findOne({ 'facebook.id' : profile.id }, function(err, prevUser) {
          if( err) { return; }
          if( prevUser == null ) { return; }
          
          // Remove old user with this facebook data
          if( !prevUser._id.equals(req.user._id)) {
            prevUser.facebook.token = undefined;
        		prevUser.save();
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
