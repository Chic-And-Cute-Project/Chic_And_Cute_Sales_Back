const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

console.log("C&C backend api started");

const uri = process.env.MONGO_URI || "mongodb+srv://joserodrigolopez:xK22YDi1adZJdw25@mongodbdeployed.nr8iyxd.mongodb.net/c&c_back";

connection(uri);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(port, () => {
    console.log("Node server running in port:", port);
});