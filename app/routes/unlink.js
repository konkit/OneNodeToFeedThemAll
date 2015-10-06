module.exports = function(app, passport) {

	app.get('/unlink/facebook', function(req, res) {
		req.user
			.unlinkFromFacebook()
			.save(function(err) {
				res.redirect('/profile');
			});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		req.user
			.unlinkFromTwitter()
			.save(function(err) {
				res.redirect('/profile');
			});
	});
}
