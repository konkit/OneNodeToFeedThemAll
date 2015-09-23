var User       = require('../app/models/user');
var Post 			 = require('../app/models/post');

module.exports = {
	'url' : process.env.MONGOLAB_URI || 'mongodb://localhost/test'
};
