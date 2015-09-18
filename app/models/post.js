var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    id: String,
    data: Schema.Types.ObjectId
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Post', postSchema);
