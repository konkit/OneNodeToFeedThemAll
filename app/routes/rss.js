module.exports = function(app, passport) {
  mongoose = require('mongoose');
  restler = require('restler');

  User = mongoose.model('User')
  Post = mongoose.model('Post')

  function sendError(req, res, err) {
    console.log("!!!");
    console.log("Error: " + err);
    console.log("!!!");
    return res.status(400).send({error: err});
  }

  function checkIfRss(newRssUrl, success, error) {
    restler.get(newRssUrl).on('complete', function(rss) {
      if( typeof rss.rss !== 'undefined' && typeof rss.rss.$.version !== 'undefined' ) {
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

    if( typeof req.session.passport == 'undefined' ) {
      return res.send('Please log in first');
    }

    checkIfRss(newRssUrl, function() {
      addRssChannels(req, res, newRssUrl);
    }, function() {
      sendError(req, res, {message: 'Not a RSS channel'})
    });
  });

  app.post('/api/rssFeeds/remove', function(req, res) {
    if( typeof req.session.passport == 'undefined' ) {
      return res.send('Please log in first');
    }
    User.findById( req.session.passport.user, function(err, user) {
      if( err ) {  return sendError(req, res, err); }
      user.rssFeeds.pull(req.body.url)
      Post.find({rssUrl: req.body.url.url, user: user}).remove().exec();
      user.save(function(err) {
        if( err ) { return sendError(req, res, err); }
        res.sendStatus(200);
      });
    });
  });
}
