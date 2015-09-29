restler = require('restler');
mongoose = require('mongoose');

require('../app/models/post');

User = mongoose.model('User')
Post = mongoose.model('Post')

  function getRssFeed(user, resultCallback, errorCallback) {
    user.rssFeeds.forEach(function(feedUrl) {
      console.log(feedUrl);

      restler.get(feedUrl).on('complete', function(result) {
        //eval(require('locus'))

        if( typeof result.rss !== 'undefined' && typeof result.rss.$.version !== 'undefined' ) {
          result.rss.channel.forEach(function(channel) {
            resultCallback(channel.item);
          });
        }
      });
    });
  }

  function saveUserFeed(user) {
    getRssFeed(user, function(result) {
      result.forEach(function(post) {
        Post.findOneOrCreate({id: post.title, type: 'rss'}, {
          id: post.title,
          date: (new Date(post.pubDate)).toISOString(),
          type: 'rss',
          feedData: {
            pubDate: post.pubDate,
            title: post.title,
            link: post.link,
            description: post.description
          },
          user: user
        }, function(err, createdPost) {
          if( err ) console.log('Post saving error: ' + err)
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
