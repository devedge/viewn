# viewn
A locally hosted video server project, written using Express.

## Info:
This is a Plex/Youtube-like video server for serving local video files, but designed with scalability concepts in mind. As such, it's currently split into three sections, but more may be added later on. These three system are `viewn-web`, `viewn-api`, & `viewn-vidfs`.

### `viewn-web`
The stateless web frontend, written in Node using Expressjs & Pug for server-side rendering, and Bulma for the frontend CSS framework. It uses Webpack to build & include all frontend dependencies. Additionally, Plyr is used to style+add functionality to the html5 video elements. As of right now, the frontend is statically generated, but that may change in the future with a framework such as Vue or React. If a frontend framework is added, a new `viewn-client-api` will be added, to serve frontend REST requests.

### `viewn-api`
A REST API representing stateful data to present. Its purpose is to provide data to the stateless webserver ONLY, and isn't client accessible. Currently, it's being mocked using `json-server`, but eventually, it will become a full database with a REST API, using MongoDB. Additionally, it will likely have a caching layer using REDIS.

### `viewn-vidfs`
A static webserver, currently written in Express, whose only purpose is to serve the video content, thumbnails, and posters. It uses PM2 to cluster the servers and spread the load across several instances. Eventually, this will be rewritten in a more performant language (likely Golang) since Node is not as well-equipped to serve large static content.

This was originally setup in nginx, but configuration issues (error 405 not properly handled, & file permissions hassle) means that nginx will instead be used as a reverse proxy to cache video data instead.

Note: While videos can be directly served (if the browsers can support it), they are much faster when re-encoded as HLS or DASH videos.
