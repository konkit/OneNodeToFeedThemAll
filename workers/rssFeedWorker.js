module.exports = function(timeout) {
  var restler = require('restler');
  var mongoose = require('mongoose');
  var FeedParser = require('feedparser'), request = require('request');
  var async = require('async');

  require('../app/models/post');

  User = mongoose.model('User')
  Post = mongoose.model('Post')


  intervalFunction();
  setInterval(function() { intervalFunction(); }, timeout);

  function intervalFunction() {
    console.log('Fetching from RSS');

    User.find({}, function(err, users) {
      async.forEach(users, function(user, index) {
        async.forEach(user.rssFeeds, function(feedUrl) {
          getRssFeed(user, feedUrl);
        });
      });
    });
  }

  function getRssFeed(user, feedUrl) {
    var req = request(feedUrl.url), feedparser = new FeedParser();

    req.on('error', function (errorMsg) {
      console.log('Error: ' + errorMsg);
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
      while (post = stream.read()) {
        savePost(post, feedUrl, user);
      }
    });
  }

  function savePost(post, feedUrl, user) {
    Post.findOneOrCreate({id: post.title, type: 'rss', user: user}, {
      id: post.title,
      date: (new Date(post.pubDate)).toISOString(),
      type: 'rss',
      rssUrl: feedUrl.url,
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
  }
}
