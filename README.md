# viewn
A prototype locally hosted video server

### Notes:
- Three seperate Express servers: `viewn-web`, `viewn-api`, & `viewn-vidfs`
- `viewn-web` - The stateless web frontend, using the Bulma CSS framework
- `viewn-api` - Currently a mocked REST API, using `json-server`
- `viewn-vidfs` - A static webserver just for serving videos + their posters
