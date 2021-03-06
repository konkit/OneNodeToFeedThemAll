(function() {
  restler = require('restler');
  mongoose = require('mongoose');

  var FeedParser = require('feedparser'), request = require('request');

  require('../app/models/post');
  var async = require('async');

  User = mongoose.model('User')
  Post = mongoose.model('Post')

  exports.run = function() {
    console.log('Post cache cleaner running');
    var date = new Date();
    date.setDate(date.getDate() - 1);
    Post.remove({'date': {'$lt': date}})
  }
}());
