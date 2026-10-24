require('dotenv').config();
const app = require("./src/config/app");
const http = require("http");

const myServer = http.createServer(app);

myServer.listen(process.env.PORT, ()=> console.log(`Expense Tracker Server is Listening on port ${process.env.PORT}`));