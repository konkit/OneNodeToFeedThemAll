restler = require('restler');
mongoose = require('mongoose');

var FeedParser = require('feedparser'), request = require('request');

require('../app/models/post');

User = mongoose.model('User')
Post = mongoose.model('Post')

  function getRssFeed(user, resultCallback, errorCallback) {
    user.rssFeeds.forEach(function(feedUrl) {
      var req = request(feedUrl.url), feedparser = new FeedParser();

      req.on('error', function (errorMsg) {
        errorCallback(errorMsg);
      });

      req.on('response', function (res) {
        var stream = this;
        if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
        stream.pipe(feedparser);
      });

      feedparser.on('error', function(errorMsg) {
        errorCallback(errorMsg);
      });

      feedparser.on('readable', function() {
        var stream = this, meta = this.meta, item;

        while (item = stream.read()) {
          //console.log(item);
          resultCallback(item, feedUrl);
        }
      });

      // restler.get(feedUrl.url).on('complete', function(result) {
      //
      //   if( typeof result.rss !== 'undefined' && typeof result.rss.$.version !== 'undefined' ) {
      //     result.rss.channel.forEach(function(channel) {
      //       resultCallback(channel, feedUrl);
      //     });
      //   } else {
      //     errorCallback('RSS error - not in proper RSS format!');
      //   }
      // });
    });
  }

  function saveUserFeed(user) {
    getRssFeed(user, function(post, rssUrl) {
      Post.findOneOrCreate({id: post.title, type: 'rss', user: user}, {
        id: post.title,
        date: (new Date(post.pubDate)).toISOString(),
        type: 'rss',
        rssUrl: rssUrl.url,
        feedData: {
          channelName: '',
          pubDate: post.pubDate,
          title: post.title,
          link: post.link,
          description: post.description
        },
        user: user
      }, function(err, createdPost) {
        if( err ) console.log('Post saving error: ' + err)
      })

    }, function(msg) {
      console.log(msg);
    })
  }

  function intervalFunction() {
    console.log('RSS feed worker');

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
