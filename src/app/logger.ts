const COLOR_MAGENTA = '\x1b[35m';
const COLOR_YELLOW = '\x1b[33m';
const COLOR_CYAN = '\x1b[36m';
const COLOR_GREEN = '\x1b[32m';
const COLOR_RED = '\x1b[31m';
const COLOR_RESET = '\x1b[0m';

import {Request} from "@hapi/hapi";

export function handleResponse(request: Request) {
    if ('statusCode' in request.response) {
        const method = request.method.toUpperCase().padEnd(20);
        const path = request.path.padEnd(40);
        const time = new Date().toLocaleTimeString().padEnd(20);
        const statusCode = request.response.statusCode.toString().padEnd(10);
        const responseTime = ((request.info.completed - request.info.received).toString() + 'ms').padEnd(15);

        const methodOutput = `${COLOR_MAGENTA}${method}${COLOR_RESET}`;
        const pathOutput = `${COLOR_YELLOW}${path}${COLOR_RESET}`;
        const timeOutput = `${COLOR_CYAN}${time}${COLOR_RESET}`;
        const statusCodeOutput = `${COLOR_GREEN}${statusCode}${COLOR_RESET}`;
        const responseTimeOutput = `${COLOR_RED}${responseTime}${COLOR_RESET}`;

        console.log(`${methodOutput} ${pathOutput} ${statusCodeOutput} ${responseTimeOutput} ${timeOutput}`);
    }
}