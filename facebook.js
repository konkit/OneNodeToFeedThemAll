module.exports = function(app, passport) {
  var restler = require('restler');
  var FacebookStrategy = require('passport-facebook').Strategy

  exports.facebookAuthToken = facebookAuthToken = null;

  passport.use(new FacebookStrategy({
      clientID: '198776883637263',
      clientSecret: '77b1d915639b2c2b6c08db5d7b011cbb',
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      facebookAuthToken = accessToken;
      console.log('facebookAuthToken: ' + facebookAuthToken);
      done(null, profile);
    }
  ));


  app.get('/facebook_feed', function(req, res) {
    if( facebookAuthToken == null ) {
      return res.redirect('/auth/facebook');
    }

    base_url = 'https://graph.facebook.com/v2.3/'
    url = base_url + 'me/home/?'
    url = url + 'access_token=' + facebookAuthToken
    url = url + '&fields=from,story,picture,description,link,message,created_time,updated_time'
    restler.get(url).on('complete', function(fbResult) {
      console.log('URL: ' + url)
      console.log('Result: ' + fbResult);
      res.send(fbResult);
    })
  });


  app.get(
    '/auth/facebook',
    passport.authenticate('facebook',
      { scope: ['user_status', 'user_posts', 'read_stream'] }
    )
  );

  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook',
      {
        successRedirect: '/facebook_feed',
        failureRedirect: '/login'
      }
    )
  );
}
