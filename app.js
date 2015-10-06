var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path     = require('path');
var bodyParser = require('body-parser');

// Mongo setup
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

var session = require('express-session')
sessionStore = new session.MemoryStore;

// set up express
app.use(require('morgan')('combined')); // logging
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ store: sessionStore, secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// set up ejs for templating
app.set('view engine', 'ejs');

// static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));

// routes
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// Starting workers
rssFeedWorker = require('./workers/rssFeedWorker.js');
twitterFeedWorker = require('./workers/twitterFeedWorker.js');
postCacheCleaner = require('./workers/postCacheCleaner.js');

rssFeedWorker.run();
setInterval(function() {
  rssFeedWorker.run();
}, 1000 * 10);

twitterFeedWorker.run();
setInterval(function() {
  twitterFeedWorker.run();
}, 1000 * 120);

postCacheCleaner.run();
setInterval(function() {
  postCacheCleaner.run();
}, 1000 * 3600 * 6);


// launch
app.listen(port);
console.log('The magic happens on port ' + port);
