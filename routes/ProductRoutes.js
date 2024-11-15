const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

router.post("/", ProductController.create);
router.get("/listByPage", ProductController.listByPage);
router.get("/count", ProductController.getCount);
router.delete("/", ProductController.deleteById);
router.put("/", ProductController.update);
router.get("/search", ProductController.searchProduct);
router.get("/countByProduct", ProductController.getCountByProduct);

module.exports = router;