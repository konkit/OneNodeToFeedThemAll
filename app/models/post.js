var Promise = require("bluebird"),
    mongoose = Promise.promisifyAll(require('mongoose')),
    findOneOrCreate = require('mongoose-find-one-or-create')

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

postSchema.statics.saveRssPost = function(post, feedUrl, user) {
  var findData = {id: post.title, type: 'rss', user: user};
  var createData = {
    id: post.title,
    date: (new Date(post.pubDate)).toISOString(),
    type: 'rss',
    rssUrl: feedUrl.url,
    feedData: {
      channelName: '',
      pubDate: post.pubDate,
      title: post.title,
      link: post.link,
      description: post.description
    },
    user: user
  }

  return new Promise(function(resolve, reject) {
    Post.findOne(findData, function(err, post) {
      if( post == null ) {
        Post.create(createData, function(err, newPost) {
          if(err) { throw err; }
          resolve(newPost);
        });
      } else {
        if(err) { throw err; }
        resolve(post);
      }
    });
  });

  // Post.findOneOrCreate({id: post.title, type: 'rss', user: user}, {
  //   id: post.title,
  //   date: (new Date(post.pubDate)).toISOString(),
  //   type: 'rss',
  //   rssUrl: feedUrl.url,
  //   feedData: {
  //     channelName: '',
  //     pubDate: post.pubDate,
  //     title: post.title,
  //     link: post.link,
  //     description: post.description
  //   },
  //   user: user
  // }, function(err, createdPost) {
  //   if( err ) console.log('Post saving error: ' + err)
  // })
}

postSchema.statics.saveTwitterPost = function(post, user) {
  Post.findOneOrCreate({id: post.id, type: 'twitter', user: user}, {
    id: post.id,
    date: (new Date(post.created_at)).toISOString(),
    type: 'twitter',
    feedData: post,
    user: user
  }, function(err, post) {
    if( err ) console.log('!Error: ' + err)
  });
}

module.exports = mongoose.model('Post', postSchema);
