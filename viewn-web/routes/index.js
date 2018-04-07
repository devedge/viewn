var express = require('express');
var router = express.Router();
var urljoin = require('url-join');

/* GET home page. */
router.get('/', function(req, res, next) {
  const client = req.app.locals.client;

  client.get('/recent/', async (err, result, body) => {
    if (err) {
      console.error(err);
      return res.sendStatus(404);
    }

    // The list of videos
    let videolist = [];

    // From the '/recent/' endpoint (which only contain video IDs),
    // re-request the '/videos/' endpoint for specific video info.
    // TODO improve this, it's not clean. 
    
    // 'await' the execution of this function
    await body.reduce(function(promise, id) {
      return promise.then((result) => {
        // The function that returns a promise, and that we want to
        // synchronously execute.
        return client.get('/videos/' + id).then((result) => {
          let item = result.body;
          // After each of these executions, use a 'then' to execute the
          // desired item (eg., push value on array).
          videolist.push({
            title: item.title,
            poster: urljoin(req.app.locals.VID_ENDPOINT, item.id, item.poster),
            video_link: '/watch?v=' + item.id
          });
        });
      });
    }, Promise.resolve()); // resolve this promise

    // Render the page
    res.render('index', {
      title: 'viewn',
      videolinks: videolist
    });
  });
});

module.exports = router;
