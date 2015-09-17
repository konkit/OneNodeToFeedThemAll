
module.exports = function(mongoose) {
    var findOneOrCreate = require('mongoose-find-one-or-create');
    var userSchema = new mongoose.Schema({
    username: String,
    id: String,
    type: String,
    facebookToken: String,
    twitterToken: String,
    twitterSecret: String,
  });
  userSchema.plugin(findOneOrCreate);
  return mongoose.model('User', userSchema);
}
