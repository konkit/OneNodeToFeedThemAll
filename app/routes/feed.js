module.exports = function(app, passport) {

  mongoose = require('mongoose');

  User = mongoose.model('User')
  Post = mongoose.model('Post')

  app.get('/feed/', function(req, res) {
    // eval(require('locus'))

    if( typeof req.session.passport == 'undefined' ) {
      return res.send('Please log in first');
    }

    User.findById(req.session.passport.user, function(err, user) {
      if( err ) console.log(err);
      
      Post.find({user: user._id}, function(err, posts) {
        res.send(posts)
      });
    });
  });

}
