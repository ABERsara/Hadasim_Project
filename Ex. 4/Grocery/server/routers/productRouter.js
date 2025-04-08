const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

router.get("/", productController.getProducts);
router.get("/:_id", productController.getProduct);
router.post("/", productController.addProduct);

module.exports = router;