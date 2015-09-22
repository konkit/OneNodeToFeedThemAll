var mongoose = require('mongoose');
var findOneOrCreate = require('mongoose-find-one-or-create')

var User = require('./user')

var postSchema = mongoose.Schema({
    id: String,
    date: Date,
    type: String,
    feedData: mongoose.Schema.Types.Mixed,
    user: { type: mongoose.Schema.ObjectId, ref: 'User'}
});

postSchema.plugin(findOneOrCreate);

// create the model for users and expose it to our app
module.exports = mongoose.model('Post', postSchema);
