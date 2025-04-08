const Order = require("../models/Order");
const Supplier = require("../models/Supplier");
const Product = require("../models/Product");

const getOrders = async (req, res) => {
    const limit = parseInt(req.query.limit) || 0;
    try {
        const orders = await Order.find({})
            .limit(limit)
            .populate('supplierId', 'companyName')
            .populate('products.productId', 'productName price')
            .lean();
        if (!orders.length) {
            return res.status(404).json({
                error: true,
                message: "No orders found",
                data: null
            });
        }
        res.json({
            error: false,
            message: "Orders found",
            data: orders
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            data: null
        });
    }
};

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
                message: "Order not found",
                data: null
            });
        }
        res.json({
            error: false,
            message: "Order found",
            data: order
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            data: null
        });
    }
};

const createOrder = async (req, res) => {
    const { supplierId, products } = req.body;
    if (!supplierId || !products || !products.length) {
        return res.status(400).json({
            error: true,
            message: "Supplier ID and product list are required",
            data: null
        });
    }
    try {
        const supplierExists = await Supplier.exists({ _id: supplierId });
        if (!supplierExists) {
            return res.status(400).json({
                error: true,
                message: "Supplier does not exist",
                data: null
            });
        }
        for (const product of products) {
            const productExists = await Product.exists({ _id: product.productId });
            if (!productExists) {
                return res.status(400).json({
                    error: true,
                    message: `Product ${product.productId} does not exist`,
                    data: null
                });
            }
            if (product.quantity <= 0) {
                return res.status(400).json({
                    error: true,
                    message: `Product quantity ${product.productId} is invalid`,
                    data: null
                });
            }
        }
        const order = await Order.create({ supplierId, products });
        res.status(201).json({
            error: false,
            message: "New order created",
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

const updateOrderStatus = async (req, res) => {
    const { _id, status } = req.body;
    if (!_id || !status) {
        return res.status(400).json({
            error: true,
            message: "ID and status are required",
            data: null
        });
    }
    if (!['pending', 'inProgress', 'completed'].includes(status)) {
        return res.status(400).json({
            error: true,
            message: "Invalid status",
            data: null
        });
    }
    try {
        const order = await Order.findById(_id).exec();
        if (!order) {
            return res.status(404).json({
                error: true,
                message: "Order not found",
                data: null
            });
        }
        order.status = status;
        const updatedOrder = await order.save();
        res.json({
            error: false,
            message: `Order status updated to ${status}`,
            data: updatedOrder
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            data: null
        });
    }
};

module.exports = { getOrders, getOrder, createOrder, updateOrderStatus };