const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

// אחזור כל המוצרים
router.get("/", productController.getProducts);

// אחזור מוצר בודד לפי ID
router.get("/:_id", productController.getProduct);

// הוספת מוצר חדש
router.post("/", productController.addProduct);

module.exports = router;