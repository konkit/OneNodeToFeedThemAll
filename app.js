var express = require('express');
var Twit = require('twit');
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
var restler = require('restler');
var util = require('util');

var T = null;

var app = express();
// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var facebookAuthToken = null;
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


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
