  mongoose = require('mongoose');

// load up the user model
var User = mongoose.model('User')

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  require('./passport-strategies/passport-local.js')(passport);
  require('./passport-strategies/passport-facebook.js')(passport);
  require('./passport-strategies/passport-twitter.js')(passport);
};
