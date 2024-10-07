const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();

console.log("ChicAndCute backend api started");

connection(process.env.MONGO_URI);

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

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
const SaleRoutes = require("./routes/SaleRoutes");
app.use("/api/sales", SaleRoutes);
const CloseSalesDayRoutes = require("./routes/CloseSalesDayRoutes");
app.use("/api/close-sales-day", CloseSalesDayRoutes);

app.get("/test-route", (_req, res) => {
    return res.status(200).json({
        "version": "1.2.0"
    });
});

app.listen(port, () => {
    console.log("Node server running in port:", port); 
});