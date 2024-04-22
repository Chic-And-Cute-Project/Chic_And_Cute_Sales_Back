const express = require("express");
const router = express.Router();
const InventoryController = require("../controllers/InventoryController");

const check = require("../authorization/auth");

router.post("/", InventoryController.create);
router.get("/list", InventoryController.list);
router.get("/sede", InventoryController.getBySede);
router.put("/", InventoryController.update);
router.get("/mySede", check.auth, InventoryController.getByMySede);
router.get("/availableSede", InventoryController.getAvailableBySede);
router.get("/search", InventoryController.searchProductBySede);
router.get("/mySearch", check.auth, InventoryController.searchProductsByMySede);

module.exports = router;