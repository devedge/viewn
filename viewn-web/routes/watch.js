var express = require('express');
var router = express.Router();
var urljoin = require('url-join');
var Base64 = require('../src/javascripts/base64');

/* Handles GET requests to the video page */
router.get('/', function(req, res, next) {
  const client = req.app.locals.client;

  // There is one parameter handled now, 'v', which refers to the video id
  let video_id = req.query.v;
  // let last_time = req.query.t; // maybe add support for this one later (time)

  if (!video_id) {
    return res.sendStatus(404);
  }

  client.get('/videos/' + video_id, function(err, result, body) {
    // If there were errors while querying the stateful backend server API
    if (err) {
      return res.end(err);
    } else if (result.statusCode === 404) {
      return res.sendStatus(404);
    }

    // To pass 'global' pagedata to the in-page scripts, add it as a Base64 encoded
    // string in a script tag in the head. Not best-practice, and will have to change 
    // to async REST requests.
    let pagedata = {
      pageid: video_id
    }
    if (body.timestamp) {
      pagedata.timestamp = body.timestamp;
    }

    // TODO Directly pass in the thumbnail id, but maybe consider requesting video url
    // after page is loaded?
    res.render('watch', {
      video_link: urljoin(req.app.locals.VID_ENDPOINT, body.id, body.media),
      video_title: body.title,
      video_poster: urljoin(req.app.locals.VID_ENDPOINT, body.id, body.poster),
      video_type: body.type,
      pagedata: encodePageData(pagedata),  // page metadata
      title: body.title                    // page title
    });
  });
});


/* Encode a 'script-safe' string with json data about the page */
function encodePageData(pagedata) {
  return Base64.encode(JSON.stringify(pagedata));
}

module.exports = router;
