module.exports = function(app, passport) {
	// home page
	app.get('/', function(req, res) {
		if( req.isAuthenticated() ) {
			return res.redirect('/profile');
		}
		res.render('index.ejs');
	});

	app.get('/profile', function(req, res) {
		if (!req.isAuthenticated()) {
			res.redirect('/');
		}

		res.render('profile.ejs', {
			user : req.user
		});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	require('./routes/auth.js')(app, passport);
	require('./routes/authorize.js')(app, passport);
	require('./routes/unlink.js')(app, passport);
	require('./routes/feed.js')(app, passport);
};
