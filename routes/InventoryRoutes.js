const express = require("express");
const router = express.Router();
const InventoryController = require("../controllers/InventoryController");

const check = require("../authorization/auth");

router.post("/", InventoryController.create);
router.get("/sede", InventoryController.getBySede);
router.get("/countBySede", InventoryController.getCountBySede);
router.put("/", InventoryController.update);
router.get("/mySede", check.auth, InventoryController.getByMySede);
router.get("/countByMySede", check.auth, InventoryController.getCountByMySede);
router.get("/availableSedePages", InventoryController.getAvailableBySede);
router.get("/countBySedeAndAvailable", InventoryController.getCountBySedeAndAvailable);
router.get("/myAvailableSede", check.auth, InventoryController.getAvailableByMySede);
router.get("/countByMySedeAndAvailable", check.auth, InventoryController.getCountByMySedeAndAvailable);
router.get("/searchStock", InventoryController.searchProductStockBySede);
router.get("/countBySedeAndProduct", InventoryController.getCountBySedeAndProduct);
router.get("/searchAvailablePages", InventoryController.searchProductAvailableBySede);
router.get("/countBySedeAndProductAndAvailable", InventoryController.getCountBySedeAndProductAndAvailable);
router.get("/mySearchStock", check.auth, InventoryController.searchProductsStockByMySede);
router.get("/countByMySedeAndProduct", check.auth, InventoryController.getCountByMySedeAndProduct);
router.get("/mySearchAvailable", check.auth, InventoryController.searchProductsAvailableByMySede);
router.get("/countByMySedeAndProductAndAvailable", check.auth, InventoryController.getCountByMySedeAndProductAndAvailable);
router.get("/productIdAndSede", InventoryController.getByProductIdAndSede);

module.exports = router;