var express = require('express');
var router = express.Router();

/* Returns the webpage to view a video */
router.get('/', function(req, res, next) {
  let video_id = req.query.v;

  if (!video_id) {
    return res.sendStatus(404);
  }

  client.get(video_id, function(err, result, body) {
    if (err) {
      return res.end(err);
    } else if (result.statusCode === 404) {
      return res.sendStatus(404);
    }

    res.render('watch', {
      video_url: 'video/' + video_id, // handled by the 'video/' route
      video_title: body.title,
      video_thumb: body.poster,
      video_type: body.type
    });
  });
});

module.exports = router;
