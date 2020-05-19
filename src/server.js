const Server = require('boardgame.io/server').Server;
const Salem = require('./game').Salem;
const server = Server({ games: [Salem] });
server.run(8000);