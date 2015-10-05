restler = require('restler');
mongoose = require('mongoose');
var Twit = require('twit')

require('../app/models/post');

var configAuth = require('../config/auth');

User = mongoose.model('User')
Post = mongoose.model('Post')

  function getTwitterFeed(user, resultCallback) {
    if( typeof user.twitter.tokenSecret === "undefined" || typeof user.twitter.token === "undefined" ){
      console.log("[ERROR]: token or tokenSecret from Twitter is missing");
      return;
    }

    var T = new Twit({
      consumer_key:         configAuth.twitterAuth.consumerKey,
      consumer_secret:      configAuth.twitterAuth.consumerSecret,
      access_token:         user.twitter.token,
      access_token_secret:  user.twitter.tokenSecret
    })

    T.get('statuses/home_timeline/' + user.twitter.username, { count: 500 }, function(err, data, response) {
      if(err) { console.log('Err: ' + err); }
      resultCallback(data);
    })
  }

  function saveUserFeed(user) {
    getTwitterFeed(user, function(result) {
      if(typeof result.errors !== 'undefined') {
        return console.log('!!! ERRORS : ' + JSON.stringify(result.errors));
      }

      result.forEach(function(post) {
        Post.findOneOrCreate({id: post.id, type: 'twitter', user: user}, {
          id: post.id,
          date: (new Date(post.created_at)).toISOString(),
          type: 'twitter',
          feedData: post,
          user: user
        }, function(err, post) {
          if( err ) console.log('!Error: ' + err)
        })
      })
    })
  }

  function intervalFunction() {
    User.find({}, function(err, users) {
      users.forEach(function(user, index) {
        saveUserFeed(user);
      });
    });
  }

module.exports = function(timeout) {
  intervalFunction();
  setInterval(function() {
    intervalFunction();
  }, timeout);
}
