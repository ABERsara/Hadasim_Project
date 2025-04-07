const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();

// אחזור כל ההזמנות
router.get("/", orderController.getOrders);

// אחזור הזמנה בודדת לפי ID
router.get("/:_id", orderController.getOrder);

// יצירת הזמנה חדשה
router.post("/", orderController.createOrder);

// עדכון סטטוס הזמנה
router.put("/status", orderController.updateOrderStatus);

module.exports = router;