import Express from 'express';
import * as http from 'http';
import * as path from 'path';
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname,'/index.html'));
})


server.listen(port, () => {
    console.log(`Listening on port ${port}`);
})