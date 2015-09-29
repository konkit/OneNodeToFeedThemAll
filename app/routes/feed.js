module.exports = function(app, passport) {

  mongoose = require('mongoose');

  User = mongoose.model('User')
  Post = mongoose.model('Post')

  app.get('/api/feeds/', function(req, res) {
    if( typeof req.session.passport == 'undefined' ) {
      return res.status(401).send('Please log in first');
    }

    User.findById(req.session.passport.user, function(err, user) {
      if( err ) console.log(err);

      var possibleTypes = [];
      if( req.query.fb == 'true' ) {
        possibleTypes.push('facebook');
      }
      if( req.query.tw == 'true' ) {
        possibleTypes.push('twitter');
      }

      var query = Post.find({user: user._id, type: { $in: possibleTypes } });
      query.sort('-date');
      query.limit(req.query.limit || 100)
      query.exec(function(err, posts) {
        res.send(posts)
      });
    });
  });

}
