  mongoose = require('mongoose');

// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;

// load up the user model
var User = mongoose.model('User')

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

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

          if( password != req.body.password_confirmation ) {
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
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = profile.emails[0].value;

                user.save(function(err) {
                  if (err) { throw err; }
                  return done(null, user);
                });
              }
              return done(null, user);
            } else {
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
          });
        } else {
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
};
