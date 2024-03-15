import * as dotenv from "dotenv";
import {init, start} from "./app/server";

dotenv.config();

process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
});

init()
    .then(() => {
        start().then(r => r);
    })
    .catch((err) => {
        console.log(`Error starting server: ${err.message}`);
    });