module.exports = function(app, passport, User) {
  var TwitterStrategy = require('passport-twitter').Strategy
  var Twit = require('twit');

  passport.use(new TwitterStrategy({
      consumerKey: '4qf5IouYYD554s5PN02pdMui7',
      consumerSecret: 'QEwsLu0IN8QJlWAsT1AfFE5uG5c9ie6AERnMOmSIHTENYhg5bY',
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
      user = {
        id: profile.id,
        username: profile.screen_name,
        type: 'twitter',
        twitterToken: token,
        twitterSecret: tokenSecret
      }
      User.findOneOrCreate({id: user.id, type: user.type}, user, function(err, person) {});
      done(null, user);
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
    if( typeof req.session.passport !== 'object' ) {
      return res.redirect('/auth/twitter');
    }

    T = new Twit({
      consumer_key:        '4qf5IouYYD554s5PN02pdMui7',
      consumer_secret:     'QEwsLu0IN8QJlWAsT1AfFE5uG5c9ie6AERnMOmSIHTENYhg5bY',
      access_token:        req.session.passport.user.twitterToken,
      access_token_secret: req.session.passport.user.twitterSecret,
    });

    T.get('statuses/home_timeline/konkit', { count: 100 }, function(err, data, response) {
      res.send(data);
    })
  });
}
