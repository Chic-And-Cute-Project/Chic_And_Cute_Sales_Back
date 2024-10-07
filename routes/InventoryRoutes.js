const express = require("express");
const router = express.Router();
const InventoryController = require("../controllers/InventoryController");

const check = require("../authorization/auth");

router.post("/", InventoryController.create);
router.get("/sede", InventoryController.getBySede);
router.put("/", InventoryController.update);
router.get("/mySede", check.auth, InventoryController.getByMySede);
router.get("/availableSede", InventoryController.getAvailableBySede);
router.get("/myAvailableSede", check.auth, InventoryController.getAvailableByMySede);
router.get("/searchStock", InventoryController.searchProductStockBySede);
router.get("/searchAvailable", InventoryController.searchProductAvailableBySede);
router.get("/mySearchStock", check.auth, InventoryController.searchProductsStockByMySede);
router.get("/mySearchAvailable", check.auth, InventoryController.searchProductsAvailableByMySede);

module.exports = router;