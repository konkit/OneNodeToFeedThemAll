var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path     = require('path');

// Mongo setup
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

var session = require('express-session')
sessionStore = new session.MemoryStore;

// set up express
app.use(require('morgan')('combined')); // logging
app.use(require('cookie-parser')());
app.use(require('body-parser').json());
app.use(session({ store: sessionStore, secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// set up ejs for templating
app.set('view engine', 'ejs');

// static files
app.use(express.static(path.join(__dirname, 'public')));

// routes
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

require('./workers/facebookFeedWorker.js')(10000);
require('./workers/rssFeedWorker.js')(10000);
require('./workers/twitterFeedWorker.js')(100000);

// launch
app.listen(port);
console.log('The magic happens on port ' + port);
