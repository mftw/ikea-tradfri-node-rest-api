const http = require("http");
const app = require("./app");

const port = process.env.SERVER_PORT || 3000;

const server = http.createServer(app);

server.listen(port);

console.log(`API running @ http://localhost:${port}`);
