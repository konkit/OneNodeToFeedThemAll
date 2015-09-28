module.exports = function(app, passport) {
  mongoose = require('mongoose');

  User = mongoose.model('User')
  Post = mongoose.model('Post')

  function sendError(req, res, err) {
    console.log("!!!");
    console.log("Error: " + err);
    console.log("!!!");
    return res.status(400).send({error: err});
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
    if( typeof req.session.passport == 'undefined' ) {
      return res.send('Please log in first');
    }
    User.findById( req.session.passport.user, function(err, user) {
      if( err ) {  return sendError(req, res, err); }
      user.rssFeeds.addToSet( req.body.url )
      user.save(function(err) {
        if( err ) { return sendError(req, res, err); }
        res.sendStatus(200);
      });
    });
  });

  app.post('/api/rssFeeds/remove', function(req, res) {
    if( typeof req.session.passport == 'undefined' ) {
      return res.send('Please log in first');
    }
    User.findById( req.session.passport.user, function(err, user) {
      if( err ) {  return sendError(req, res, err); }
      user.rssFeeds.pull(req.body.url)
      user.save(function(err) {
        if( err ) { return sendError(req, res, err); }
        res.sendStatus(200);
      });
    });
  });
}
