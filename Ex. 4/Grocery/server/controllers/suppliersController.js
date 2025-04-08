const Supplier = require("../models/Supplier");

const getSuppliers = async (req, res) => {
    const limit = parseInt(req.query.limit) || 0;
    try {
        const suppliers = await Supplier.find({}).limit(limit).populate('goodsList').lean();
        if (!suppliers.length) {
            return res.status(404).json({
                error: true,
                message: "No suppliers found",
                data: null
            });
        }
        res.json({
            error: false,
            message: "Suppliers found",
            data: suppliers
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            data: null
        });
    }
};

const getSupplier = async (req, res) => {
    const { _id } = req.params;
    try {
        const supplier = await Supplier.findById(_id).populate('goodsList').lean();
        if (!supplier) {
            return res.status(404).json({
                error: true,
                message: "Supplier not found",
                data: null
            });
        }
        res.json({
            error: false,
            message: "Supplier found",
            data: supplier
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            data: null
        });
    }
};

const addSupplier = async (req, res) => {
    const { password, companyName, phoneNumber, representativeName, goodsList } = req.body;
    if (!password || !companyName || !phoneNumber || !representativeName || !goodsList || !goodsList.length) {
        return res.status(400).json({
            error: true,
            message: "Password, company name, phone number, representative name, and goods list are required",
            data: null
        });
    }
    try {
        const existingSupplier = await Supplier.findOne({ companyName }).lean();
        if (existingSupplier) {
            return res.status(409).json({
                error: true,
                message: "Supplier with this company name already exists",
                data: null
            });
        }
        const supplier = await Supplier.create({ password, companyName, phoneNumber, representativeName, goodsList });
        res.status(201).json({
            error: false,
            message: "New supplier created " + companyName,
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
const getSupplierProducts = async (req, res) => {
    const { supplierId } = req.params;
    try {
        const supplier = await Supplier.findById(supplierId).populate('goodsList').lean();
        if (!supplier) {
            return res.status(404).json({
                error: true,
                message: "Supplier not found",
                data: null
            });
        }
        res.json({
            error: false,
            message: "Supplier's products found",
            data: supplier.goodsList
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
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