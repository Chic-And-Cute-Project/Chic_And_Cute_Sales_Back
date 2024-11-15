const express = require("express");
const router = express.Router();
const DiscountController = require("../controllers/DiscountController");

router.post("/", DiscountController.create);
router.get("/list", DiscountController.list);
router.put("/", DiscountController.update);

module.exports = router;