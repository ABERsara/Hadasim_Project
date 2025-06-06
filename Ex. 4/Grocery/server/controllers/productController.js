const Product = require("../models/Product");

const getProducts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 0;
    try {
        const products = await Product.find({}).limit(limit).lean();
        if (!products.length) {
            return res.status(404).json({
                error: true,
                message: "No products found",
                data: null
            });
        }
        res.json({
            error: false,
            message: "Products found",
            data: products
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            data: null
        });
    }
};

const getProduct = async (req, res) => {
    const { _id } = req.params;
    try {
        const product = await Product.findById(_id).lean();
        if (!product) {
            return res.status(404).json({
                error: true,
                message: "Product not found",
                data: null
            });
        }
        res.json({
            error: false,
            message: "Product found",
            data: product
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            data: null
        });
    }
};

const addProduct = async (req, res) => {
    const { productName, price, minimumQuantity } = req.body;
    if (!productName || !price || !minimumQuantity) {
        return res.status(400).json({
            error: true,
            message: "Product name, price, and minimum quantity are required",
            data: null
        });
    }
    try {
        // Checking for duplicates
        const existingProduct = await Product.findOne({
            productName,
            price,
            minimumQuantity,
        });

        if (existingProduct) {
            return res.status(400).json({ message: 'Product already exists, check the product list.'+productName });
        }
        const product = await Product.create({ productName, price, minimumQuantity });
        res.status(201).json({
            error: false,
            message: "New product created " + productName,
            data: product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({
            error: true,
            message: error.message,
            data: null
        });
    }
};

module.exports = {
    getProducts,
    getProduct,
    addProduct
};