restler = require('restler');

  function saveUserFeed(user) {
    feeds = getFBFeed(user.facebook.token, function(result) {
      // save feeds
    })
  }

  function intervalFunction() {
    User.find({}, function(err, users) {
      users.forEach(function(user, index) {
        saveUserFeed(user);
      });
    });
  }

  function getFBFeed(fbToken, resultCallback) {
    base_url = 'https://graph.facebook.com/v2.3/'
    action = 'me/home/'
    url = base_url + action + '?access_token=' + fbToken
    url = url + '&fields=from,story,picture,description,link,message,created_time,updated_time'
    restler.get(url).on('complete', function(fbResult) {
      console.log('URL: ' + url)
      console.log('Result: ' + fbResult);
      resultCallback(fbResult);
    })
  }

module.exports = function(timeout = 10000) {
  setInterval(function() {
    intervalFunction();
  }, timeout);
}
