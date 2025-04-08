const Stock = require('../models/Stock');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

const getStockItems = async (req, res) => {
    const limit = parseInt(req.query.limit) || 0;
    try {
        const stockItems = await Stock.find({}).limit(limit).populate('supplierProducts.supplierId').populate('supplierProducts.product').lean();
        if (!stockItems.length) {
            return res.status(404).json({
                error: true,
                message: 'No stock items found',
                data: null,
            });
        }
        res.json({
            error: false,
            message: 'Stock items found',
            data: stockItems,
        });
    } catch (err) {
        console.error('Error fetching stock items:', err);
        return res.status(500).json({
            error: true,
            message: 'Internal server error',
            data: null,
        });
    }
};

const getStockItem = async (req, res) => {
    const { _id } = req.params;
    try {
        const stockItem = await Stock.findById(_id).populate('supplierProducts.supplierId').lean();
        if (!stockItem) {
            return res.status(404).json({
                error: true,
                message: 'Stock item not found',
                data: null,
            });
        }
        res.json({
            error: false,
            message: 'Stock item found',
            data: stockItem,
        });
    } catch (err) {
        console.error('Error fetching stock item:', err);
        return res.status(500).json({
            error: true,
            message: 'Internal server error',
            data: null,
        });
    }
};


const addStockItem = async (req, res) => {
    try {
        const { name, uniqueId, minimumQuantity } = req.body;
        const supplierProducts = [];

        const productsWithName = await Product.find({ productName: name });

        for (const product of productsWithName) {
            // Search for suppliers whose goodsList array directly contains the current product's ID
            const suppliers = await Supplier.find({
                goodsList: product._id
            });

            suppliers.forEach(supplier => {
                // Since goodsList is simply an array of Product ObjectIds,
                // we know this supplier provides the current product.
                // Therefore, we can directly add the relationship.
                supplierProducts.push({
                    supplierId: supplier._id,
                    product: product._id,
                });
            });
        }

        const newStockItem = new Stock({
            name,
            uniqueId,
            currentQuantity: 0,
            minimumQuantity,
            supplierProducts,
        });

        const savedStockItem = await newStockItem.save();
        res.status(201).json(savedStockItem);
    } catch (error) {
        console.error('Error adding stock item:', error);
        res.status(500).json({ message: 'Failed to add stock item' });
    }
};

module.exports = {
    getStockItems,
    getStockItem,
    addStockItem
};