module.exports = function(app, express, passport) {
  var rssRouter = express.Router();

  rssRouter.use(function(req, res, next) {
    if( typeof req.session.passport == 'undefined' ) {
      return res.send('Please log in first');
    }
    next();
  });

  rssRouter.route('/rssFeeds')
    .get(function(req, res) {
      User.findById( req.session.passport.user, function(err, user) {
        if( err ) console.log(err);
        res.send(user.rssFeeds)
      });
    })
    .post(function(req, res) {
      User.update(
        { id: req.session.passport.user },
        { $addToSet: { rssFeeds: req.body.rssFeed.url } }
      ).exec();
    })

  app.use('/api', rssRouter);
}
