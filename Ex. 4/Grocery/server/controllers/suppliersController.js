const Supplier = require("../models/Supplier");

// אחזור כל הספקים
const getSuppliers = async (req, res) => {
    const limit = parseInt(req.query.limit) || 0;
    try {
        const suppliers = await Supplier.find({}).limit(limit).populate('goodsList').lean();
        if (!suppliers.length) {
            return res.status(404).json({
                error: true,
                message: "לא נמצאו ספקים",
                data: null
            });
        }
        res.json({
            error: false,
            message: "ספקים נמצאו",
            data: suppliers
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "שגיאת שרת פנימית",
            data: null
        });
    }
};

// אחזור ספק בודד לפי ID
const getSupplier = async (req, res) => {
    const { _id } = req.params;
    try {
        const supplier = await Supplier.findById(_id).populate('goodsList').lean();
        if (!supplier) {
            return res.status(404).json({
                error: true,
                message: "ספק לא נמצא",
                data: null
            });
        }
        res.json({
            error: false,
            message: "ספק נמצא",
            data: supplier
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "שגיאת שרת פנימית",
            data: null
        });
    }
};

// הוספת ספק חדש
const addSupplier = async (req, res) => {
    const { password, companyName, phoneNumber, representativeName, goodsList } = req.body;
    if (!password || !companyName || !phoneNumber || !representativeName || !goodsList || !goodsList.length) {
        return res.status(400).json({
            error: true,
            message: "סיסמה, שם חברה, מספר טלפון, שם נציג ורשימת מוצרים נדרשים",
            data: null
        });
    }
    try {
        // בדיקה אם ספק עם שם חברה זהה כבר קיים
        const existingSupplier = await Supplier.findOne({ companyName }).lean();
        if (existingSupplier) {
            return res.status(409).json({ // 409 Conflict
                error: true,
                message: "ספק עם שם חברה זה כבר קיים",
                data: null
            });
        }
        const supplier = await Supplier.create({ password, companyName, phoneNumber, representativeName, goodsList });
        res.status(201).json({
            error: false,
            message: "ספק חדש נוצר " + companyName,
            data: supplier
        });
    } catch (error) {
        console.error('Error creating supplier:', error);
        res.status(400).json({
            error: true,
            message: error.message,
            data: null
        });
    }
};
// אחזור רשימת מוצרים של ספק לפי ID
const getSupplierProducts = async (req, res) => {
    const { supplierId } = req.params;
    try {
        const supplier = await Supplier.findById(supplierId).populate('goodsList').lean();
        if (!supplier) {
            return res.status(404).json({
                error: true,
                message: "ספק לא נמצא",
                data: null
            });
        }
        res.json({
            error: false,
            message: "מוצרים של ספק נמצאו",
            data: supplier.goodsList
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "שגיאת שרת פנימית",
            data: null
        });
    }
};
module.exports = {
    getSuppliers,
    getSupplier,
    addSupplier,
    getSupplierProducts
};