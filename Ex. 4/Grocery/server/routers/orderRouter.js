const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();

router.get("/", orderController.getOrders);
router.get("/:_id", orderController.getOrder);
router.post("/", orderController.createOrder);
router.put("/status", orderController.updateOrderStatus);

module.exports = router;