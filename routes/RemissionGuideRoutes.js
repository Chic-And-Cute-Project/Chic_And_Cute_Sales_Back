const express = require("express");
const router = express.Router();
const RemissionGuideController = require("../controllers/RemissionGuideController");

router.post("/", RemissionGuideController.create);

module.exports = router;