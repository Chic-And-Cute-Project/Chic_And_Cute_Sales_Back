const express = require("express");
const router = express.Router();
const SaleController = require("../controllers/SaleController");

const check = require("../authorization/auth");

router.post("/", check.auth, SaleController.create);
router.get("/list", SaleController.list);

module.exports = router;