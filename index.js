const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

console.log("ChicAndCute backend api started");

const uri = process.env.MONGO_URI || "mongodb+srv://joserodrigolopez:xK22YDi1adZJdw25@mongodbdeployed.nr8iyxd.mongodb.net/c&c_back";

connection(uri);

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserRoutes = require("./routes/UserRoutes");
app.use("/api/users", UserRoutes);
const ProductRoutes = require("./routes/ProductRoutes");
app.use("/api/products", ProductRoutes);
const DiscountRoutes = require("./routes/DiscountRoutes");
app.use("/api/discounts", DiscountRoutes);
const InventoryRoutes = require("./routes/InventoryRoutes");
app.use("/api/inventories", InventoryRoutes);
const RemissionGuideRoutes = require("./routes/RemissionGuideRoutes");
app.use("/api/remission-guides", RemissionGuideRoutes);

app.get("/test-route", (_req, res) => {
    return res.status(200).json({
        "version": "0.0.0"
    });
});

app.listen(port, () => {
    console.log("Node server running in port:", port); 
});