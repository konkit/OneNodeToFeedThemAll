var mongoose = require('mongoose');
var findOneOrCreate = require('mongoose-find-one-or-create')

var User = require('./user')

var postSchema = mongoose.Schema({
    id: String,
    date: Date,
    type: String,
    rssUrl: String,
    feedData: mongoose.Schema.Types.Mixed,
    user: { type: mongoose.Schema.ObjectId, ref: 'User'}
});

postSchema.plugin(findOneOrCreate);

module.exports = mongoose.model('Post', postSchema);
