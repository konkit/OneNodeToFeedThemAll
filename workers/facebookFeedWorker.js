restler = require('restler');
mongoose = require('mongoose');

require('../app/models/post');

User = mongoose.model('User')
Post = mongoose.model('Post')

  function getFBFeed(fbToken, resultCallback) {
    base_url = 'https://graph.facebook.com/v2.3/'
    action = 'me/home/'
    url = base_url + action + '?access_token=' + fbToken
    url = url + '&fields=from,story,picture,description,link,message,created_time,updated_time'
    restler.get(url).on('complete', function(fbResult) {
      if( typeof fbResult.data == 'undefined') {
        return console.log(fbResult);
      }
      resultCallback(fbResult.data);
    })
  }

  function saveUserFeed(user) {
    getFBFeed(user.facebook.token, function(result) {
      console.log('FB result : ' + result);

      result.forEach(function(post) {
        Post.findOneOrCreate({id: post.id, type: 'facebook'}, {
          id: post.id,
          date: (new Date(post.created_time)).toISOString(),
          type: 'facebook',
          feedData: post,
          user: user
        }, function(err, createdPost) {
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
