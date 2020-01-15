const fs = require("fs");
const yml = require("js-yaml");
const path = require("path");

const serverConfigPath = "server-config.yml";
const serverConfigHerokuPath = "server-config-heroku.yml";

let serverConfig;

let isOnline = (process.env.PORT !== undefined);

try {
  if (isOnline) {
    serverConfig = yml.safeLoad(
        fs.readFileSync(path.join(__dirname, serverConfigHerokuPath), "utf8")
    );
    serverConfig.deploy = "heroku";
    serverConfig.server.port = process.env.PORT;
  } else {
    serverConfig = yml.safeLoad(
        fs.readFileSync(path.join(__dirname, serverConfigPath), "utf8")
    );
    serverConfig.deploy = "local";
  }

  console.log("Server config file loaded.");
} catch (e) {
  console.log("Could not load the server config file");
  process.exit(1);
}


module.exports.serverConfig = serverConfig;