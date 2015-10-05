module.exports = function(app, passport) {
  mongoose = require('mongoose');
  restler = require('restler');
  feed = require("feed-read");

  User = mongoose.model('User')
  Post = mongoose.model('Post')

  app.get('/api/rssFeeds', function(req, res) {
    if( typeof req.session.passport == 'undefined' ) {
      return res.send('Please log in first');
    }
    User.findById( req.session.passport.user, function(err, user) {
      if( err ) { return sendError(req, res, err); }
      res.send(user.rssFeeds)
    });
  });

  app.post('/api/rssFeeds', function(req, res) {
    newRssUrl = req.body.url

    if( !newRssUrl.match('^http(s)?://') ) {
      newRssUrl = 'http://' + newRssUrl;
    }

    if( typeof req.session.passport == 'undefined' ) {
      return res.send('Please log in first');
    }

    checkIfRss(newRssUrl, function() {
      addRssChannels(req, res, newRssUrl);
    }, function() {
      sendError(req, res, {message: 'Not a RSS channel'})
    });
  });

  app.delete('/api/rssFeeds/:rssUrlId', function(req, res) {
    if( typeof req.session.passport == 'undefined' ) {
      return res.send('Please log in first');
    }

    User.findById( req.session.passport.user, function(err, user) {
      if( err ) {  return sendError(req, res, err); }

      var rssEntry = user.rssFeeds.id(req.params.rssUrlId);
      Post.find({rssUrl: rssEntry.url, user: user}).remove().exec();
      rssEntry.remove();
      user.save(function(err) {
        if( err ) { return sendError(req, res, err); }
        res.sendStatus(200);
      });
    });
  });

  function sendError(req, res, err) {
    console.log("!!!");
    console.log("Error: " + err);
    console.log("!!!");
    return res.status(400).send({error: err});
  }

  function checkIfRss(newRssUrl, success, error) {
    if( !newRssUrl.match('^http(s)?://') ) {
      newRssUrl = 'http://' + newRssUrl;
    }

    restler.get(newRssUrl).on('complete', function(rss) {
      if( typeof rss.rss === 'object' && typeof rss.rss.$.version !== 'undefined' ) {
        success();
      } else if( typeof rss === 'string' && feed.identify(rss) != false ) {
        success();
      } else {
        error();
      }
    });
  }

  function addRssChannels(req, res, newRssUrl) {
    User.findById( req.session.passport.user, function(err, user) {
      if( err ) {  return sendError(req, res, err); }
      user.rssFeeds.addToSet({url: newRssUrl})
      user.save(function(err) {
        if( err ) { return sendError(req, res, err); }
        res.sendStatus(200);
      });
    });
  }


}
