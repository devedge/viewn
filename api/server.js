// Entrypoint for the REST server
// TODO: version the API endpoint, eg.: <hostname>/api/v1/

const http = require("http");
const app = require("./app");

const port = process.env.PORT || 8090;
const server = http.createServer(app);
server.listen(port);
