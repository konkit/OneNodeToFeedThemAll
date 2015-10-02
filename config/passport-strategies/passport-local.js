module.exports = function(passport) {
  var LocalStrategy    = require('passport-local').Strategy;
  var configAuth = require('../auth');

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({ 'local.email' :  email }, function(err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, req.flash('localAuthMessage', 'No user found.'));
        }

        if (!user.validPassword(password)) {
          return done(null, false, req.flash('localAuthMessage', 'Oops! Wrong password.'));
        } else {
          return done(null, user);
        }
      });
    });
  }));

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({'local.email': email}, function(err, existingUser) {
        if (err) {
          return done(err);
        }

        if (existingUser) {
          return done(null, false, req.flash('localAuthMessage', 'That email is already taken.'));
        }

        if( password != req.body.
          password_confirmation ) {
          return done(null, false, req.flash('localAuthMessage', 'Password and its confirmation do not match.'));
        }

        if(req.user) {
          var user            = req.user;
          user.local.email    = email;
          user.local.password = user.generateHash(password);
          user.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, user);
          });
        } else {
          var newUser            = new User();
          newUser.local.email    = email;
          newUser.local.password = newUser.generateHash(password);

          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));
}
