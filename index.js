const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');

console.log("ChicAndCute backend api started");

const uri = process.env.MONGO_URI || "mongodb+srv://joserodrigolopez:xK22YDi1adZJdw25@mongodbdeployed.nr8iyxd.mongodb.net/c&c_back";

connection(uri);

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test-route", (_req, res) => {
    return res.status(200).json({
        "version": "0.0.0"
    });
});

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ['http://localhost:4200'],
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const requests = require('./socket-requests/requests');
requests(io);

server.listen(port, () => {
    console.log("Node server running in port:", port); 
});