const Order = require("../models/Order");
const Supplier = require("../models/Supplier");
const Product = require("../models/Product");

// אחזור כל ההזמנות
const getOrders = async (req, res) => {
    const limit = parseInt(req.query.limit) || 0;
    try {
        const orders = await Order.find({})
            .limit(limit)
            .populate('supplierId', 'companyName') // רק שם החברה
            .populate('products.productId', 'productName price') // רק שם ומחיר מוצר
            .lean();
        if (!orders.length) {
            return res.status(404).json({
                error: true,
                message: "לא נמצאו הזמנות",
                data: null
            });
        }
        res.json({
            error: false,
            message: "הזמנות נמצאו",
            data: orders
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "שגיאת שרת פנימית",
            data: null
        });
    }
};

// אחזור הזמנה בודדת לפי ID
const getOrder = async (req, res) => {
    const { _id } = req.params;
    try {
        const order = await Order.findById(_id)
            .populate('supplierId', 'companyName')
            .populate('products.productId', 'productName price')
            .lean();
        if (!order) {
            return res.status(404).json({
                error: true,
                message: "הזמנה לא נמצאה",
                data: null
            });
        }
        res.json({
            error: false,
            message: "הזמנה נמצאה",
            data: order
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "שגיאת שרת פנימית",
            data: null
        });
    }
};

// יצירת הזמנה חדשה
const createOrder = async (req, res) => {
    const { supplierId, products } = req.body;
    if (!supplierId || !products || !products.length) {
        return res.status(400).json({
            error: true,
            message: "ID ספק ורשימת מוצרים נדרשים",
            data: null
        });
    }
    try {
        // בדיקה אם ספק ומוצרים קיימים
        const supplierExists = await Supplier.exists({ _id: supplierId });
        if (!supplierExists) {
            return res.status(400).json({
                error: true,
                message: "ספק לא קיים",
                data: null
            });
        }
        for (const product of products) {
            const productExists = await Product.exists({ _id: product.productId });
            if (!productExists) {
                return res.status(400).json({
                    error: true,
                    message: `מוצר ${product.productId} לא קיים`,
                    data: null
                });
            }
            if (product.quantity <= 0) {
                return res.status(400).json({
                    error: true,
                    message: `כמות מוצר ${product.productId} לא תקינה`,
                    data: null
                });
            }
        }
        const order = await Order.create({ supplierId, products });
        res.status(201).json({
            error: false,
            message: "הזמנה חדשה נוצרה",
            data: order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(400).json({
            error: true,
            message: error.message,
            data: null
        });
    }
};

// עדכון סטטוס הזמנה
const updateOrderStatus = async (req, res) => {
    const { _id, status } = req.body;
    if (!_id || !status) {
        return res.status(400).json({
            error: true,
            message: "ID וסטטוס נדרשים",
            data: null
        });
    }
    if (!['pending', 'inProgress', 'completed'].includes(status)) {
        return res.status(400).json({
            error: true,
            message: "סטטוס לא תקין",
            data: null
        });
    }
    try {
        const order = await Order.findById(_id).exec();
        if (!order) {
            return res.status(404).json({
                error: true,
                message: "הזמנה לא נמצאה",
                data: null
            });
        }
        order.status = status;
        const updatedOrder = await order.save();
        res.json({
            error: false,
            message: `סטטוס הזמנה עודכן ל-${status}`,
            data: updatedOrder
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "שגיאת שרת פנימית",
            data: null
        });
    }
};

module.exports = { getOrders, getOrder, createOrder, updateOrderStatus };