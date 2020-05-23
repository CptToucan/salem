/*
const Server = require('boardgame.io/server').Server;
const Salem = require('./game').Salem;
const server = Server({ games: [Salem] });
server.run(8000);
*/


import { Server } from 'boardgame.io/server';
import path from 'path';
import serve from 'koa-static';
import { Salem } from './game';

const server = Server({ games: [Salem] });
const PORT = process.env.PORT || 8000;

// Build path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, './build');
server.app.use(serve(frontEndAppBuildPath))

server.run(PORT, () => {
  server.app.use(
    async (ctx, next) => await serve(frontEndAppBuildPath)(
      Object.assign(ctx, { path: 'index.html' }),
      next
    )
  )
});