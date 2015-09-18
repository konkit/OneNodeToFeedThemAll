module.exports = function(app, passport) {

	app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));
	app.get('/connect/facebook/callback',
		passport.authorize('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

	app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));
	app.get('/connect/twitter/callback',
		passport.authorize('twitter', {
			successRedirect : '/profile',
			failureRedirect : '/'
		})
	);
}
