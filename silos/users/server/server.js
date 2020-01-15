const express = require("express");
var bodyParser = require("body-parser");
const http = require("http");
var session = require('express-session');
const dataLayerUser = require('../server/dataLayerUser');
const routes = require('./user');
const config = require(`${process.cwd()}/config/config`);

class Server {
  constructor() {
    this.server = express();
    this.server.use(express.json());
  this.server.use(bodyParser.json());
  this.server.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
  	this.server.use(
		bodyParser.urlencoded({
			extended: true
		})
    );


    this.server.use("/api", routes);
  }

  start(host, port) {
      //HEROKU COND
      if (config.serverConfig.deploy === "heroku") {
          this.server.listen(port, () => {
              console.log(`Listening on '${host}' on the port ${port}...`);
          })
      } else {
        this.server.set('port', process.env.PORT || port);
        dataLayerUser.init(function(){
          console.log("Connected to db");
        });
        http.createServer(this.server).listen(this.server.get('port'), host, function() {
            console.log(`Listening on '${host}' on the port ${port}...`);
        });
      }

  }
}

module.exports = new Server();