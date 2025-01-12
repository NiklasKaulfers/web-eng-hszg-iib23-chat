import Express from 'express';
import * as http from 'http';
import * as path from 'path';

const app = Express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;

app.get("/", function (req, res) {
    res.sendFile('/index.html');
})


server.listen(port, () => {
    console.log(`Listening on port ${port}`);
})