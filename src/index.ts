"use strict";

import * as dotenv from "dotenv";
import Hapi, { Server } from "@hapi/hapi";

dotenv.config();

export let server: Server;

export const init = async function (): Promise<Server> {
  server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
    routes: {
      cors: {
        credentials: true,
      }
    }
  });

  server.ext("onRequest", (request, h) => {
    const method = request.method.toUpperCase().padEnd(10);
    const path = request.path.padEnd(50);
    const time = new Date().toLocaleTimeString();
    console.log(`\x1b[35m${method} \x1b[0m${path} ${time}`);
    return h.continue;
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello World!";
    }
  });

  return server;
};


export const start = async function (): Promise<void> {
  console.log(`Server running on ${server.info.uri}`);

  await server.start();
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init()
  .then(() => { start(); })
  .catch((err) => {
    console.log(`Error starting server: ${err.message}`);
  });