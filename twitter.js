module.exports = function(app, passport) {
  var TwitterStrategy = require('passport-twitter').Strategy
  var Twit = require('twit');

  exports.T = T = null;

  passport.use(new TwitterStrategy({
      consumerKey: '4qf5IouYYD554s5PN02pdMui7',
      consumerSecret: 'QEwsLu0IN8QJlWAsT1AfFE5uG5c9ie6AERnMOmSIHTENYhg5bY',
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
      twitterToken = token;
      twitterTokenSecret = tokenSecret;

      console.log('token: ' + twitterToken + ', tokenSecret: ' + twitterTokenSecret);

      T = new Twit({
          consumer_key:         '4qf5IouYYD554s5PN02pdMui7'
        , consumer_secret:      'QEwsLu0IN8QJlWAsT1AfFE5uG5c9ie6AERnMOmSIHTENYhg5bY'
        , access_token:         token
        , access_token_secret:  tokenSecret
      });


      done(null, profile);
    }
  ));


  app.get(
    '/auth/twitter',
    passport.authenticate('twitter')
  );

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/twitter_feed');
    });

  app.get('/twitter_feed', function (req, res) {
    if( T == null ) {
      return res.redirect('/auth/twitter');
    }

    T.get('statuses/home_timeline/konkit', { count: 100 }, function(err, data, response) {
      res.send(data);
    })
  });
}
