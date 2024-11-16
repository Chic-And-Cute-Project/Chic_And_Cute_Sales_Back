const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

const check = require("../authorization/auth");

router.post("/register", UserController.register);
router.post("/login", UserController.loginUser);
router.get("/myObject", check.auth, UserController.profile);
router.get("/list", UserController.getAll);
router.get("/getAllSales", UserController.getAllUserSales);
router.put("/", UserController.updateUser);
router.get("/search", UserController.searchUserSales);

module.exports = router;