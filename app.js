var express = require('express');

var Twit = require('twit')

var T = new Twit({
    consumer_key:         '4qf5IouYYD554s5PN02pdMui7'
  , consumer_secret:      'QEwsLu0IN8QJlWAsT1AfFE5uG5c9ie6AERnMOmSIHTENYhg5bY'
  , access_token:         '49361574-eH0zW35v0wc82h4kSEnHKx1VwahvlA93eJHpNa0T8'
  , access_token_secret:  '9rE6oyAHdxxF2a0iq9m9D3csZCaVrJZpVfOBPzdD42oqs'
});

var app = express();

app.get('/', function (req, res) {
  T.get('statuses/home_timeline/konkit', { count: 100 }, function(err, data, response) {
    res.send(data);
  })
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
