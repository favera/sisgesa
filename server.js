//Back server
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('mdldb.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
});

//App server
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
app = express();
app.use(serveStatic(__dirname + "/"));
var port = process.env.PORT || 5000;
app.listen(port);
console.log('server started ' + port);