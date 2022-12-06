import app from "./app";
import dotenv from "dotenv";
import { createServer } from "https";

dotenv.config();

const PORT = process.env.PORT || 5000;


// app.listen(PORT, () => {
//     console.log(`App is listening on port ${PORT}`);
// });

const fs = require('fs')

const credentials = {
    key: fs.readFileSync(process.env.KEY_PATH + 'MyKey.key'),
    cert: fs.readFileSync(process.env.KEY_PATH + 'MyCertificate.crt'),
};
console.log("creating server on",PORT)

const server = createServer(credentials, app);
server.listen(PORT);