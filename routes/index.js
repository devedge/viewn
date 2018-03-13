var express = require('express');
var router = express.Router();
var reqjson = require('request-json');

// Simulate a REST API + database backend with json-server.
// The URL is the default serve endpoint
let client = reqjson.createClient('http://localhost:3000');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {

    // Figure out an ID-based content-addressable system. Right now,
    // just requesting 'video'
    client.get('video')
      .then(function(result) {
        res.render('index', {
          video_url: "/video/" + result.body.videoname,
          video_type: result.body.content_type,
          video_title: result.body.title,
          video_thumbnail: result.body.thumbnail
        });
      }).catch(function(err) {
        res.end(err);
      });
  });
});

module.exports = router;
