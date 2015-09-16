var express = require('express');
var Twit = require('twit');
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
var restler = require('restler');
var util = require('util');

var T = new Twit({
    consumer_key:         '4qf5IouYYD554s5PN02pdMui7'
  , consumer_secret:      'QEwsLu0IN8QJlWAsT1AfFE5uG5c9ie6AERnMOmSIHTENYhg5bY'
  , access_token:         '49361574-eH0zW35v0wc82h4kSEnHKx1VwahvlA93eJHpNa0T8'
  , access_token_secret:  '9rE6oyAHdxxF2a0iq9m9D3csZCaVrJZpVfOBPzdD42oqs'
});

var facebookAuthToken = null;

var app = express();
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

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



app.get('/twitter_feed', function (req, res) {
  T.get('statuses/home_timeline/konkit', { count: 100 }, function(err, data, response) {
    res.send(data);
  })
});

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
    {
      scope: ['user_status', 'user_posts', 'read_stream']
    }
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


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
