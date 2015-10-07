
var chai = require('chai')
    expect = chai.expect,
    chaiAsPromised = require("chai-as-promised"),
    mockgoose = require('mockgoose'),
    mongoose = require('mongoose'),
    sinon = require('sinon'),
    mockery = require('mockery');

// Wrapping
chai.use(chaiAsPromised);
mockgoose(mongoose);

require('../app/models/post');
require('../app/models/user');
User = mongoose.model('User')
Post = mongoose.model('Post')

// Mongo setup
var configDB = require('../config/database.js');
mongoose.connect(configDB.url); // connect to our database

RssFeedWorker = require('../workers/rssFeedWorker');

describe('Post', function() {

  describe('saveRssPost', function() {
    var rssPost = {
      title: 'Title of the post',
      pubDate: new Date(),
      link: 'http://onet.pl',
      description: 'This is a post'
    }
    var feedUrl = { url: 'http://google.com' }
    var user;

    beforeEach(function(done) {
      mockgoose.reset();
      User.create({}, function(err, newUser) {
        if(err) { throw err; }
        user = newUser;
        done();
      })
    })

    it('should properly save id of Post if it doesnt exist', function(done) {
      var promise = Post.saveRssPost(rssPost, feedUrl, user)
      expect(promise).to.eventually
        .have.deep.property('id', rssPost.title)
        .and.notify(done)
    });

    it('should properly save date of Post if it doesnt exist', function(done) {
      var promise = Post.saveRssPost(rssPost, feedUrl, user)
      expect(promise).to.eventually
        .have.deep.property('date')
        .and.notify(done)
    });

    it('should properly save type of Post if it doesnt exist', function(done) {
      var promise = Post.saveRssPost(rssPost, feedUrl, user)
      expect(promise).to.eventually
        .have.deep.property('type', 'rss')
        .and.notify(done)
    });

    it('should properly save rssUrl of Post if it doesnt exist', function(done) {
      var promise = Post.saveRssPost(rssPost, feedUrl, user)
      expect(promise).to.eventually
        .have.deep.property('rssUrl', feedUrl.url)
        .and.notify(done)
    });

    it('should properly save feedData.pubDate of Post if it doesnt exist', function(done) {
      var promise = Post.saveRssPost(rssPost, feedUrl, user)
      expect(promise).to.eventually
        .have.deep.property('feedData.pubDate')
        .and.notify(done)
    });

    it('should properly save feedData.title of Post if it doesnt exist', function(done) {
      var promise = Post.saveRssPost(rssPost, feedUrl, user)
      expect(promise).to.eventually
        .have.deep.property('feedData.title', rssPost.title)
        .and.notify(done)
    });

    it('should properly save feedData.link of Post if it doesnt exist', function(done) {
      var promise = Post.saveRssPost(rssPost, feedUrl, user)
      expect(promise).to.eventually
        .have.deep.property('feedData.link', rssPost.link)
        .and.notify(done)
    });

    it('should properly save feedData.link of Post if it doesnt exist', function(done) {
      var promise = Post.saveRssPost(rssPost, feedUrl, user)
      expect(promise).to.eventually
        .have.deep.property('feedData.description', rssPost.description)
        .and.notify(done)
    });
  });

});
