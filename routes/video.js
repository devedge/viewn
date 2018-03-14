var express = require('express');
var router = express.Router();
var fs = require('fs');

/* Returns a pseudo-streamed video. */
router.get('/:id', function(req, res, next) {
  let video_id = req.params.id;

  if (!video_id) {
    return res.sendStatus(404);
  }

  client.get(video_id, function(err, result, body) {
    if (err) {
      return res.end(err);
    } else if (result.statusCode === 404) {
      return res.sendStatus(404);
    }

    streamMedia(req, res, body);
  });
});


// Function to handle streaming media
function streamMedia(req, res, video) {
  let client_range = req.headers.range;

  if (!client_range) {
    return res.sendStatus(416); // 416 Wrong range
  }

  let opts = genRanges(client_range, video.size, video.type);

  let responseHeader = {
    "Content-Range": "bytes " + opts.start + "-" + opts.end + "/" + opts.total,
    "Accept-Ranges": "bytes",
    "Content-Length": opts.contentlen,
    "Content-Type": opts.contenttype
  }

  // Write the header
  res.writeHead(206, responseHeader);

  // Generate & pipe back the response Read Stream
  let responseStream = fs.createReadStream(video.media, {
    start: opts.start,
    end: opts.end,
    autoClose: true

  }).on('open', function() {
    responseStream.pipe(res);

  }).on('error', function(err) {
    res.end(err);
  });
}


// Generate the necessary file ranges for the header & stream
// TODO Validate ranges
function genRanges(client_range, filesize, contenttype) {
  let server_range = client_range.replace("bytes=", "").split("-");
  let total = filesize;
  let start = parseInt(server_range[0], 10);
  let end = total - 1;

  if (server_range[1] !== '') {
    end = parseInt(server_range[1], 10)
  }

  let contentlen = (end - start) + 1;

  return {
    start: start,
    end: end,
    total: total,
    contentlen: contentlen,
    contenttype: contenttype
  }
}

module.exports = router;
