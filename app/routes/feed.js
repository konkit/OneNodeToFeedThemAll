module.exports = function(app, passport) {

  mongoose = require('mongoose');

  User = mongoose.model('User')
  Post = mongoose.model('Post')

  app.get('/api/feeds/', function(req, res) {
    if( typeof req.session.passport == 'undefined' ) {
      return res.send('Please log in first');
    }

    User.findById(req.session.passport.user, function(err, user) {
      if( err ) console.log(err);

      var query = Post.find({user: user._id});
      query.sort('-date');
      query.exec(function(err, posts) {
        res.send(posts)
      });
    });
  });

}
