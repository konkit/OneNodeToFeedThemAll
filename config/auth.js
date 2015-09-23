module.exports = {
	'facebookAuth' : {
		'clientID' 		 : process.env.FB_TOKEN  || '529876247193990',
		'clientSecret' : process.env.FB_SECRET || 'e624d3b5dd5b87a01ba2f9f8f9111ecb',
		'callbackURL'  : ( process.env.SERVER_URL || 'http://localhost:3000') + '/auth/facebook/callback'
	},
	'twitterAuth' : {
		'consumerKey' 		: '4qf5IouYYD554s5PN02pdMui7',
		'consumerSecret' 	: 'QEwsLu0IN8QJlWAsT1AfFE5uG5c9ie6AERnMOmSIHTENYhg5bY',
		'callbackURL' 		: ( process.env.SERVER_URL || 'http://localhost:3000') + '/auth/twitter/callback'
	}
};
