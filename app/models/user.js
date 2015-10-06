var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local: {
        email        : String,
        password     : String,
    },
    facebook: {
        id          : String,
        token       : String,
        email       : String,
        name        : String
    },
    twitter: {
        id          : String,
        token       : String,
        tokenSecret : String,
        displayName : String,
        username    : String
    },
    rssFeeds: [
      {
        url: String
      }
    ]
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// Function used when user is signing in with twitter for the first time
// Returns save promise
userSchema.statics.createTwitterUser = function(profile, token, tokenSecret) {
  var newUser                 = new User();

  newUser.twitter.id          = profile.id;
  newUser.twitter.token       = token;
  newUser.twitter.tokenSecret = tokenSecret;
  newUser.twitter.username    = profile.username;
  newUser.twitter.displayName = profile.displayName;

  return newUser.save();
}

// Used when user already has proper id, but lacks token data etc.
// Returns save promise
userSchema.methods.fillTwitterData = function(profile, token, tokenSecret) {
  this.twitter.token       = token;
  this.twitter.tokenSecret = tokenSecret;
  this.twitter.username    = profile.username;
  this.twitter.displayName = profile.displayName;

  return this.save();
}

userSchema.methods.linkWithTwitter = function(profile, token, tokenSecret) {
  User.findOne({ 'twitter.id' : profile.id }, function(err, prevUser) {
    if( err || prevUser == null ) { return; }

    if( !prevUser._id.equals(this._id)) {
      // Remove old user twitter data
      prevUser.unlinkFromTwitter();
      prevUser.save();
    }
  });

  this.twitter.id          = profile.id;
  this.twitter.token       = token;
  this.twitter.tokenSecret = tokenSecret;
  this.twitter.username    = profile.username;
  this.twitter.displayName = profile.displayName;

  return this.save();
}

userSchema.methods.unlinkFromTwitter = function() {
  this.twitter.id = undefined;
  this.twitter.token = undefined;
  return this;
}

// Function used when user is signing in with facebook for the first time
// Returns save promise
userSchema.statics.createFacebookUser = function(profile, token) {
  var newUser            = new User();

  newUser.facebook.id    = profile.id;
  newUser.facebook.token = token;
  newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
  newUser.facebook.email = profile.emails[0].value;

  return newUser.save();
}

// Used when user already has proper id, but lacks token data etc.
// Returns save promise
userSchema.methods.fillFacebookData = function(profile, token) {
  this.facebook.token = token;
  this.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
  this.facebook.email = profile.emails[0].value;

  return this.save();
}

userSchema.methods.linkWithFacebook = function(profile, token) {
  User.findOne({ 'facebook.id' : profile.id }, function(err, prevUser) {
    if( err || prevUser == null ) { return; }

    if( !prevUser._id.equals(this._id)) {
      // Remove old user with this facebook data
      prevUser.unlinkFromFacebook()
      prevUser.save();
    }
  });

  this.facebook.id    = profile.id;
  this.facebook.token = token;
  this.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
  this.facebook.email = profile.emails[0].value;
  return this.save();
}

userSchema.methods.unlinkFromFacebook = function() {
  this.facebook.id = undefined;
  this.facebook.token = undefined;
  return this;
}

module.exports = mongoose.model('User', userSchema);
