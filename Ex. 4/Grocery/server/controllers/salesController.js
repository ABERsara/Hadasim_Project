const Stock = require('../models/Stock');
const stockService = require('../services/salesService');
const processSales = async (req, res) => {

    try {
        const sales = req.body;

        for (const productName in sales) {
            const quantity = sales[productName];
            const product = await Stock.findOne({ name: productName });
            if (product) {
                product.currentQuantity -= quantity;
                await product.save();
                await stockService.checkAndOrder(product._id); 
            } 
        }

        res.status(200).json({ message: 'Sales data processed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    processSales,
};