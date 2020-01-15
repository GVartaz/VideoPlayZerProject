const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
var session = require('express-session');
const http = require("http");
const routes = require('./routes');
const config = require(`${process.cwd()}/config/config`);

class Server {
	constructor() {
		this.server = express();
		this.server.use(express.static('public'));
		this.server.use(bodyParser.json());
		this.server.use(express.json());
		this.server.enable('trust proxy');
		this.server.use(
			bodyParser.urlencoded({
				extended: true
			})
		);
		this.server.use(session({
			secret: 'keyboard cat',
			resave: false,
			saveUninitialized: true
		  }))
		this.server.use(function(req, res, next) {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
			res.setHeader('Access-Control-Allow-Headers', 'X-Requested-with, Content-Type, Authorization, x-auth-token');
			res.setHeader('Access-Control-Allow-Credentials', true);
			next();
		});
		this.server.use('/api',routes);
		
		// serve default page
		this.server.get("/", (req, res) => {
			res.send(
				fs.readFileSync(
					path.join(
						process.cwd(),
						`${config.serverConfig.server.public.root}/index.html`
					),
					"utf8"
				)
			);
		});
		
		// authorize access to public directory to server html, css, js, imgs, block-ui
		
		this.server.use(
			"/img",
			express.static(
				path.join(process.cwd(), `${config.serverConfig.server.public.imgs}`)
			)
		);
		this.server.use(
			"/css",
			express.static(
				path.join(process.cwd(), `${config.serverConfig.server.public.css}`)
			)
		);
		this.server.use(
			"/js",
			express.static(
				path.join(process.cwd(), `${config.serverConfig.server.public.js}`)
			)
		);
	
	}
	
	start(host, port) {

		const options = {};

		//HEROKU COND
		 if (config.serverConfig.deploy === "heroku") {
			this.server.listen(port, () => {
				console.log(`Listening on '${host}' on the port ${port}...`);
			});
		 } else {
			this.server.set('port', process.env.PORT || port);
			http.createServer(this.server).listen(this.server.get('port'), host, function() {
				console.log(`Listening on '${host}' on the port ${port}...`);
			});
		 }

	}
	
	failCallback(req, res, next, nextValidRequestDate) {
		console.log("TOO_MANY_ATTEMPTS");
		res
		.status(429)
		.send({ success: false, error: "TOO_MANY_ATTEMPTS" });
	}
	
	handleStoreError(error) {
		console.log(`handleStoreError: ${error}`);
		throw {
			message: error.message,
			parent: error.parent
		};
	}
}

module.exports = new Server();