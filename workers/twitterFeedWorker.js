(function() {
  var restler = require('restler');
  var mongoose = require('mongoose');
  var Twit = require('twit')
  var async = require('async');
  var configAuth = require('../config/auth');

  require('../app/models/post');

  User = mongoose.model('User');
  Post = mongoose.model('Post');

  exports.run = function() {
    console.log('Fetching from Twitter');

    User.find({}, function(err, users) {
      async.forEach(users, function(user, index) {
        getTwitterFeed(user);
      });
    });
  }

  function getTwitterFeed(user) {
    if( typeof user.twitter.tokenSecret === "undefined" || typeof user.twitter.token === "undefined" ){
      console.log("[ERROR]: token or tokenSecret from Twitter is missing");
      return;
    }

    var T = getTwitterFetchLib(user);

    T.get('statuses/home_timeline/' + user.twitter.username, { count: 500 }, function(err, data, response) {
      if(err) { console.log('Err: ' + err); }

      if(typeof data.errors !== 'undefined') {
        return console.log('!!! ERRORS : ' + JSON.stringify(data.errors));
      }

      savePosts(data, user)
    });
  }

  function savePosts(data, user) {
    async.forEach(data, function(post) {
      Post.saveTwitterPost(post, user)
    });
  }

  function getTwitterFetchLib(user) {
    return new Twit({
      consumer_key:         configAuth.twitterAuth.consumerKey,
      consumer_secret:      configAuth.twitterAuth.consumerSecret,
      access_token:         user.twitter.token,
      access_token_secret:  user.twitter.tokenSecret
    });
  }
}())
