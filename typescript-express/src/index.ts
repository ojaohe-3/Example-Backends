import app from "./app";
import dotenv from "dotenv";
import { createServer } from "https";

dotenv.config();

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`App is listening on port ${PORT}`);
// });

import fs from "fs";

const credentials = {
  key: fs.readFileSync(process.env.KEY_PATH!),
  cert: fs.readFileSync(process.env.CERT_PATH!),
};
console.log("creating server on", PORT);

const server = createServer(credentials, app);
server.listen(PORT);
