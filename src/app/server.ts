import Hapi, {Server} from "@hapi/hapi";
import routes from "./routes";

import {handleResponse} from "./logger";

export let server: Server;

export const init = async function (): Promise<Server> {
    server = Hapi.server({
        port: process.env.PORT || 9000,
        host: process.env.HOST || "localhost",
        routes: {
            cors: {
                origin: ["*"],
            }
        }
    });

    server.events.on('response', handleResponse);

    server.route(routes);

    return server;
};

export const start = async function (): Promise<void> {
    const serverInfo = `Server running on ${server.info.uri} \n`;

    console.clear();
    console.log(serverInfo);

    await server.start();
};