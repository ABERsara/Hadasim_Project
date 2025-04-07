const Stock = require('../models/Stock');
const Supplier = require('../models/Supplier');
const Order = require('../models/Order');
// const { sendNotification } = require('./notificationService');
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
        } else {
            console.log(`Product ${productName} not found.`);
        }
    }
}

async function checkAndOrder(productId) {
    const product = await Stock.findById(productId);
    if (!product) {
        console.log(`Product ${productId} not found.`);
        return;
    }

    if (product.currentQuantity < product.minimumQuantity) {
        const orderDetails = await findBestSupplier(productId);

        if (orderDetails) {
            await createOrder(orderDetails.supplierId, orderDetails.products);
        } else {
            // sendNotification(`No supplier found for ${product.name}`);
        }
    }
}

async function findBestSupplier(productId) {
    const suppliers = await Supplier.find({ goodsList: productId }).populate('goodsList');

    if (!suppliers || suppliers.length === 0) {
        return null;
    }

    let bestSupplier = null;
    let minPrice = Infinity;
    let products = [];

    for (const supplier of suppliers) {
        const productInfo = supplier.goodsList.find(p => p._id.toString() === productId.toString());
        if (productInfo && productInfo.price < minPrice) {
            minPrice = productInfo.price;
            bestSupplier = {
                supplierId: supplier._id,
            };
            products.push({productId:productId, quantity: product.minimumQuantity - product.currentQuantity})
        }
    }
    if (bestSupplier){
        return {supplierId: bestSupplier.supplierId, products: products}
    }
    return null;
}

async function createOrder(supplierId, products) {
    if (!supplierId || !products || !products.length) {
        console.log('Supplier ID and products are required');
        return;
    }

    const supplierExists = await Supplier.exists({ _id: supplierId });
    if (!supplierExists) {
        console.log('Supplier does not exist');
        return;
    }

    for (const product of products) {
        const productExists = await Product.exists({ _id: product.productId });
        if (!productExists) {
            console.log(`Product ${product.productId} does not exist`);
            return;
        }
        if (product.quantity <= 0) {
            console.log(`Quantity of product ${product.productId} is invalid`);
            return;
        }
    }

    const order = await Order.create({ supplierId, products });
    console.log(`Order created for supplier ${supplierId} order is ${order}`);
}

module.exports = {
    processSales,
};