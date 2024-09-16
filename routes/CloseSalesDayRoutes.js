const express = require("express");
const router = express.Router();
const CloseSalesDayController = require("../controllers/CloseSalesDayController");

const check = require("../authorization/auth");

router.post("/sales", check.auth, CloseSalesDayController.createFromSales);
router.post("/admin", check.auth, CloseSalesDayController.createFromAdmin);
router.get("/mySede", check.auth, CloseSalesDayController.getByMySede);
router.get("/sede", CloseSalesDayController.getBySede);

module.exports = router;