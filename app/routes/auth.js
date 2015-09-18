module.exports = function(app, passport) {

  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));

  app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));

  app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));
}
