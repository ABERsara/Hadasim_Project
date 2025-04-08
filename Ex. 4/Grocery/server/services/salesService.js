const Stock = require('../models/Stock');
const Supplier = require('../models/Supplier');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Alert = require('../models/Alert');
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

async function processSales() {
    const sales = await readSalesData();

    for (const productName in sales) {
        const quantity = sales[productName];
        const product = await Stock.findOne({ name: productName });
        if (product) {
            product.currentQuantity -= quantity;
            await product.save();
            await checkAndOrder(product._id);
        } 
    }
}


async function checkAndOrder(stockItemId) {
    try {
        const stockItem = await Stock.findById(stockItemId).populate('supplierProducts.supplierId');

        if (!stockItem || !stockItem.supplierProducts || stockItem.supplierProducts.length === 0) {
            try {
                const alert = await Alert.create({
                    type: 'No Suppliers',
                    message: `No suppliers associated with stock item ID: ${stockItemId}`,
                    stockItemId: stockItemId
                });
            } catch (error) {
                console.error('Error creating alert:', error); 
            }
            return;
        }

        const bestSupplierInfo = await findBestSupplier(stockItem.supplierProducts);

        if (bestSupplierInfo) {
            const orderDetails = {
                supplierId: bestSupplierInfo.supplierId._id, // גישה ל-_id של הספק
                products: [{
                    productId: bestSupplierInfo.product, // שימוש ב-bestSupplierInfo.product
                    quantity: stockItem.minimumQuantity - stockItem.currentQuantity,
                }]
            };
            await createOrder(orderDetails.supplierId, orderDetails.products);
        } else {
            try {
                const alert = await Alert.create({
                    type: 'No Suitable Supplier',
                    message: `No suitable supplier found for stock item ID: ${stockItemId}`,
                    stockItemId: stockItemId
                });
            } catch (error) {
                console.error('Error creating alert:', error); 
            }
        }
    } catch (error) {
        console.error('Error in checkAndOrder:', error);
    }
}


async function findBestSupplier(supplierProducts) {
    if (!supplierProducts || !Array.isArray(supplierProducts) || supplierProducts.length === 0) {
        return null;
    }

    let bestSupplierInfo = null;

    for (const sp of supplierProducts) {
        const supplierId = sp.supplierId;
        const productId = sp.product;

        const productDetails = await Product.findById(productId);

        if (productDetails) {
            if (!bestSupplierInfo || productDetails.price < bestSupplierInfo.productDetails.price) {
                bestSupplierInfo = {
                    supplierId: supplierId,
                    product: productId,
                    productDetails: productDetails 
                };
            }
        }
    }

    return bestSupplierInfo;
}
async function createOrder(supplierId, products) {
    if (!supplierId || !products || !products.length) {
        return;
    }

    const supplierExists = await Supplier.exists({ _id: supplierId });
    if (!supplierExists) {
        return;
    }

    for (const product of products) {
        const productExists = await Product.exists({ _id: product.productId });
        if (!productExists) {
            return;
        }
        if (product.quantity <= 0) {
            return;
        }
    }

    const order = await Order.create({ supplierId, products });
}

module.exports = {
    processSales,
    checkAndOrder,
    createOrder,
    findBestSupplier,
    readSalesData
};