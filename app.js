var express = require('express');
var passport = require('passport');
var util = require('util');
var path = require('path');

var session = require('express-session')
sessionStore = new session.MemoryStore;

var app = express();
// Express middleware
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(session({ store: sessionStore, secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport session
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});



// Init routes
var routes = require('./routes/index');
var users = require('./routes/users');

app.use('/', routes);
app.use('/users', users);

// Init views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Add handling FB and Twitter
facebook = require('./facebook.js')(app, passport);
twitter = require('./twitter.js')(app, passport);



module.exports = app;
