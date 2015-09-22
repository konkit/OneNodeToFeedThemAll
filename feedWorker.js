restler = require('restler');
mongoose = require('mongoose');

require('./app/models/post');

User = mongoose.model('User')
Post = mongoose.model('Post')

  function getFBFeed(fbToken, resultCallback) {
    base_url = 'https://graph.facebook.com/v2.3/'
    action = 'me/home/'
    url = base_url + action + '?access_token=' + fbToken
    url = url + '&fields=from,story,picture,description,link,message,created_time,updated_time'
    restler.get(url).on('complete', function(fbResult) {
      resultCallback(fbResult.data);
    })
  }

  function saveUserFeed(user) {
    getFBFeed(user.facebook.token, function(result) {


      result.forEach(function(post) {
        Post.findOneOrCreate({id: post.id}, {
          id: post.id,
          date: post.createdDate,
          type: 'facebook',
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

module.exports = function() {
  intervalFunction();
  setInterval(function() {
    intervalFunction();
  }, 10000);
}
