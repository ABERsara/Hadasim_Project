const Stock = require('../models/Stock');
const fs = require('fs').promises;

async function readSalesData() {
    try {
        const salesData = await fs.readFile('../data/sales.json', 'utf8');
        return JSON.parse(salesData);
    } catch (error) {
        console.error('Error reading sales data:', error);
        throw error;
    }
}

const processSales = async (req, res) => {
    try {
        const sales = await readSalesData(); // קריאה מקובץ הJSON

        for (const productName in sales) {
            const quantity = sales[productName];
            const product = await Stock.findOne({ name: productName });
            if (product) {
                product.currentQuantity -= quantity;
                await product.save();
            } else {
                console.log(`Product ${productName} not found.`);
            }
        }

        res.status(200).json({ message: 'Sales data processed successfully' });
    } catch (error) {
        console.error('Error processing sales data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    processSales,
};