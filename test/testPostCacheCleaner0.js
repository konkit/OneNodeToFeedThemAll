
var expect = require('chai').expect,
    mockgoose = require('mockgoose');

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');

// Wrap mongoose with mockgoose, so calls to DB will be intercepted
mockgoose(mongoose);

require('../app/models/post');
require('../app/models/user');
User = mongoose.model('User')
Post = mongoose.model('Post')

// Mongo setup
var configDB = require('../config/database.js');
mongoose.connect(configDB.url); // connect to our database

PostCacheCleaner = require('../workers/postCacheCleaner');

describe('PostCacheCleaner', function() {

  describe('run', function() {
    it('should remove post older than 1 day', function() {
      var date = new Date();
      date.setDate(date.getDate() - 2 );

      var post = new Post({date: date})
      post.save(function(err) {
        Post.find({}).count(function(err, count) {
          expect(count).to.equal(1);
        });
      });

      PostCacheCleaner.run();

      Post.find({}).count(function(err, count) {
        expect(count).to.equal(0);
      });
    });

    it('should NOT remove post newer than 1 day', function() {
      var date = new Date();
      date.setDate(date.getDate() );

      var post = new Post({date: date})
      post.save(function(err) {
        Post.find({}).count(function(err, count) {
          expect(count).to.equal(1);
        });
      });

      PostCacheCleaner.run();

      Post.find({}).count(function(err, count) {
        expect(count).to.equal(1);
      });
    });
  });

});
