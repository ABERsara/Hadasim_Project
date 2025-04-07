const Product = require("../models/Product");

// אחזור כל המוצרים
const getProducts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 0;
    try {
        const products = await Product.find({}).limit(limit).lean();
        if (!products.length) {
            return res.status(404).json({
                error: true,
                message: "לא נמצאו מוצרים",
                data: null
            });
        }
        res.json({
            error: false,
            message: "מוצרים נמצאו",
            data: products
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "שגיאת שרת פנימית",
            data: null
        });
    }
};

// אחזור מוצר בודד לפי ID
const getProduct = async (req, res) => {
    const { _id } = req.params;
    try {
        const product = await Product.findById(_id).lean();
        if (!product) {
            return res.status(404).json({
                error: true,
                message: "מוצר לא נמצא",
                data: null
            });
        }
        res.json({
            error: false,
            message: "מוצר נמצא",
            data: product
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "שגיאת שרת פנימית",
            data: null
        });
    }
};

// הוספת מוצר חדש
const addProduct = async (req, res) => {
    const { productName, price, minimumQuantity } = req.body;
    if (!productName || !price || !minimumQuantity) {
        return res.status(400).json({
            error: true,
            message: "שם מוצר, מחיר וכמות מינימלית נדרשים",
            data: null
        });
    }
    try {
        // בדיקת כפילות
        const existingProduct = await Product.findOne({
            productName,
            price,
            minimumQuantity,
        });

        if (existingProduct) {
            return res.status(400).json({ message: 'מוצר כזה כבר קיים, בדוק ברשימת המוצרים.'+productName });
        }
        const product = await Product.create({ productName, price, minimumQuantity });
        res.status(201).json({
            error: false,
            message: "מוצר חדש נוצר " + productName,
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