module.exports = function(mongoose) {
  var findOneOrCreate = require('mongoose-find-one-or-create');
  var postSchema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    date: Date,
    content: mongoose.Schema.Types.Mixed,
  });
  postSchema.plugin(findOneOrCreate);
  return mongoose.model('Post', postSchema);
}
