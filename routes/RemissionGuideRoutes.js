const express = require("express");
const router = express.Router();
const RemissionGuideController = require("../controllers/RemissionGuideController");

const check = require("../authorization/auth");

router.post("/", RemissionGuideController.create);
router.get("/list", RemissionGuideController.list);
router.put("/", RemissionGuideController.update);
router.get("/mySede", check.auth, RemissionGuideController.getByMySede);

module.exports = router;