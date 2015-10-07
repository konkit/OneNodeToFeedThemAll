
var chai = require('chai')
    expect = chai.expect,
    chaiAsPromised = require("chai-as-promised"),
    mockgoose = require('mockgoose'),
    mongoose = require('mongoose'),
    sinon = require('sinon'),
    mockery = require('mockery');

// Wrappings
chai.use(chaiAsPromised);
mockgoose(mongoose);

require('../app/models/post');
require('../app/models/user');
User = mongoose.model('User')
Post = mongoose.model('Post')

// Mongo setup
var configDB = require('../config/database.js');
mongoose.connect(configDB.url); // connect to our database

describe('User', function() {
  describe('createTwitterUser', function() {
    var profile = {
      id: '1234',
      username: 'Asdf',
      displayName: 'Asdf'
    }
    var token = 'asdfg', tokenSecret = 'asdfgqwert'

    it('should create user and return promise', function(done) {
      var user = User.createTwitterUser(profile, token, tokenSecret);
      expect(user).to.eventually.be.fulfilled.and.notify(done)
    });

    it('should create user with proper twitter id', function(done) {
      var user = User.createTwitterUser(profile, token, tokenSecret);
      expect(user).to.eventually.have.deep.property('twitter.id', profile.id)
        .and.notify(done)
    });

    it('should create user with proper twitter token', function(done) {
      var user = User.createTwitterUser(profile, token, tokenSecret);
      expect(user).to.eventually.have.deep.property('twitter.token', token)
        .and.notify(done)
    });

    it('should create user with proper twitter tokenSecret', function(done) {
      var user = User.createTwitterUser(profile, token, tokenSecret);
      expect(user).to.eventually.have.deep.property('twitter.tokenSecret', tokenSecret)
        .and.notify(done)
    });

    it('should create user with proper twitter username', function(done) {
      var user = User.createTwitterUser(profile, token, tokenSecret);
      expect(user).to.eventually.have.deep.property('twitter.username', profile.username)
        .and.notify(done)
    });

    it('should create user with proper twitter username', function(done) {
      var user = User.createTwitterUser(profile, token, tokenSecret);
      expect(user).to.eventually.have.deep.property('twitter.displayName', profile.displayName)
        .and.notify(done)
    });
  });

  describe('createFacebookUser', function() {
    var profile = {
      id: '1234',
      name: {
        givenName: 'John',
        familyName: 'Cocker'
      },
      emails: [{value: 'asdf@asdf.com'}]
    }
    var token = 'asdfg'

    it('should create user and return promise', function(done) {
      var user = User.createFacebookUser(profile, token);
      expect(user).to.eventually.be.fulfilled.and.notify(done)
    });

    it('should create user with proper facebook id', function(done) {
      var user = User.createFacebookUser(profile, token);
      expect(user).to.eventually
        .have.deep.property('facebook.id', profile.id)
        .and.notify(done)
    });

    it('should create user with proper facebook token', function(done) {
      var user = User.createFacebookUser(profile, token);
      expect(user).to.eventually
        .have.deep.property('facebook.token', token)
        .and.notify(done)
    });

    it('should create user with proper facebook name', function(done) {
      var user = User.createFacebookUser(profile, token);
      var expectedName = profile.name.givenName + ' ' + profile.name.familyName;
      expect(user).to.eventually
        .have.deep.property('facebook.name', expectedName)
        .and.notify(done)
    });

    it('should create user with proper facebook email', function(done) {
      var user = User.createFacebookUser(profile, token);
      expect(user).to.eventually
        .have.deep.property('facebook.email', profile.emails[0].value)
        .and.notify(done)
    });
  });

  describe('fillTwitterData', function() {
    var profile = {
      id: '1234',
      username: 'Asdf',
      displayName: 'Asdf'
    }
    var token = 'asdfg', tokenSecret = 'asdfgqwert'

    it('should create user and return promise', function(done) {
      var user = new User;
      var promise = user.fillTwitterData(profile, token, tokenSecret);
      expect(promise).to.eventually.be.fulfilled.and.notify(done)
    });

    it('should create user with proper twitter token', function(done) {
      var user = new User;
      var promise = user.fillTwitterData(profile, token, tokenSecret);
      expect(promise).to.eventually.have.deep.property('twitter.token', token)
        .and.notify(done)
    });

    it('should create user with proper twitter tokenSecret', function(done) {
      var user = new User;
      var promise = user.fillTwitterData(profile, token, tokenSecret);
      expect(promise).to.eventually.have.deep.property('twitter.tokenSecret', tokenSecret)
        .and.notify(done)
    });

    it('should create user with proper twitter username', function(done) {
      var user = new User;
      var promise = user.fillTwitterData(profile, token, tokenSecret);
      expect(promise).to.eventually.have.deep.property('twitter.username', profile.username)
        .and.notify(done)
    });

    it('should create user with proper twitter username', function(done) {
      var user = new User;
      var promise = user.fillTwitterData(profile, token, tokenSecret);
      expect(promise).to.eventually.have.deep.property('twitter.displayName', profile.displayName)
        .and.notify(done)
    });
  });

  describe('fillFacebookData', function() {
    var profile = {
      id: '1234',
      name: {
        givenName: 'John',
        familyName: 'Cocker'
      },
      emails: [{value: 'asdf@asdf.com'}]
    }
    var token = 'asdfg'

    it('should create user and return promise', function(done) {
      var user = new User;
      var promise = user.fillFacebookData(profile, token);
      expect(promise).to.eventually.be.fulfilled.and.notify(done)
    });

    it('should create user with proper facebook token', function(done) {
      var user = new User;
      var promise = user.fillFacebookData(profile, token);
      expect(promise).to.eventually
        .have.deep.property('facebook.token', token)
        .and.notify(done)
    });

    it('should create user with proper facebook name', function(done) {
      var user = new User;
      var promise = user.fillFacebookData(profile, token);
      var expectedName = profile.name.givenName + ' ' + profile.name.familyName;
      expect(promise).to.eventually
        .have.deep.property('facebook.name', expectedName)
        .and.notify(done)
    });

    it('should create user with proper facebook email', function(done) {
      var user = new User;
      var promise = user.fillFacebookData(profile, token);
      expect(promise).to.eventually
        .have.deep.property('facebook.email', profile.emails[0].value)
        .and.notify(done)
    });
  });

  describe('linkWithTwitter', function() {
    var profile = {
      id: '1234',
      username: 'Asdf',
      displayName: 'Asdf'
    }
    var token = 'asdfg', tokenSecret = 'asdfgqwert'

    it('should create user and return promise', function(done) {
      var user = new User;
      var promise = user.linkWithTwitter(profile, token, tokenSecret);
      expect(promise).to.eventually.be.fulfilled.and.notify(done)
    });

    it('should create user with proper twitter id', function(done) {
      var user = new User;
      var promise = user.linkWithTwitter(profile, token, tokenSecret);
      expect(promise).to.eventually.have.deep.property('twitter.id', profile.id)
        .and.notify(done)
    });

    it('should create user with proper twitter token', function(done) {
      var user = new User;
      var promise = user.linkWithTwitter(profile, token, tokenSecret);
      expect(promise).to.eventually.have.deep.property('twitter.token', token)
        .and.notify(done)
    });

    it('should create user with proper twitter tokenSecret', function(done) {
      var user = new User;
      var promise = user.linkWithTwitter(profile, token, tokenSecret);
      expect(promise).to.eventually.have.deep.property('twitter.tokenSecret', tokenSecret)
        .and.notify(done)
    });

    it('should create user with proper twitter username', function(done) {
      var user = new User;
      var promise = user.linkWithTwitter(profile, token, tokenSecret);
      expect(promise).to.eventually.have.deep.property('twitter.username', profile.username)
        .and.notify(done)
    });

    it('should create user with proper twitter username', function(done) {
      var user = new User;
      var promise = user.linkWithTwitter(profile, token, tokenSecret);
      expect(promise).to.eventually.have.deep.property('twitter.displayName', profile.displayName)
        .and.notify(done)
    });

    it('should unlink previous user if twitter ids duplicates', function(done) {
      var user = new User;
      var prevUser = User.create({'twitter.id': 'Asdfghj'}).then(function() {
        var promise = user.linkWithTwitter(profile, token, tokenSecret);
        expect(promise).to.eventually.have.deep.property('twitter.displayName', profile.displayName)
          .and.notify(done)
      });
    });
  });

  describe('linkWithFacebook', function() {
    var profile = {
      id: '1234',
      name: {
        givenName: 'John',
        familyName: 'Cocker'
      },
      emails: [{value: 'asdf@asdf.com'}]
    }
    var token = 'asdfg'

    it('should create user and return promise', function(done) {
      var user = new User;
      var promise = user.linkWithFacebook(profile, token);
      expect(promise).to.eventually.be.fulfilled.and.notify(done)
    });

    it('should create user with proper facebook token', function(done) {
      var user = new User;
      var promise = user.linkWithFacebook(profile, token);
      expect(promise).to.eventually
        .have.deep.property('facebook.token', token)
        .and.notify(done)
    });

    it('should create user with proper facebook name', function(done) {
      var user = new User;
      var promise = user.linkWithFacebook(profile, token);
      var expectedName = profile.name.givenName + ' ' + profile.name.familyName;
      expect(promise).to.eventually
        .have.deep.property('facebook.name', expectedName)
        .and.notify(done)
    });

    it('should create user with proper facebook email', function(done) {
      var user = new User;
      var promise = user.linkWithFacebook(profile, token);
      expect(promise).to.eventually
        .have.deep.property('facebook.email', profile.emails[0].value)
        .and.notify(done)
    });
  });

});
