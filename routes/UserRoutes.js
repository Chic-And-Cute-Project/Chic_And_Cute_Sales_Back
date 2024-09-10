const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

const check = require("../authorization/auth");

router.post("/register", UserController.register);
router.post("/login", UserController.loginUser);
router.get("/myObject", check.auth, UserController.profile);
router.get("/getAllSales", UserController.getAllUserSales);
router.get("/search", UserController.searchUserSales);
router.put("/", UserController.updateUser);

module.exports = router;