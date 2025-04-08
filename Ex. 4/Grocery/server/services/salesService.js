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
        } else {
            console.log(`Product ${productName} not found.`);
        }
    }
}


async function checkAndOrder(stockItemId) {
    console.log(`checkAndOrder called for stock item ID: ${stockItemId}`);
    try {
        const stockItem = await Stock.findById(stockItemId).populate('supplierProducts.supplierId');

        if (!stockItem || !stockItem.supplierProducts || stockItem.supplierProducts.length === 0) {
            console.log(`No suppliers associated with stock item ID: ${stockItemId}`);
            try {
                const alert = await Alert.create({
                    type: 'No Suppliers',
                    message: `No suppliers associated with stock item ID: ${stockItemId}`,
                    stockItemId: stockItemId
                });
                console.log('Alert created:', alert); // לוג הצלחה
            } catch (error) {
                console.error('Error creating alert:', error); // לוג שגיאה
            }
            return;
        }

        const bestSupplierInfo = await findBestSupplier(stockItem.supplierProducts);

        if (bestSupplierInfo) {
            console.log(`Best supplier found for stock item ID ${stockItemId}:`, bestSupplierInfo);
            const orderDetails = {
                supplierId: bestSupplierInfo.supplierId._id, // גישה ל-_id של הספק
                products: [{
                    productId: bestSupplierInfo.product, // שימוש ב-bestSupplierInfo.product
                    quantity: stockItem.minimumQuantity - stockItem.currentQuantity,
                }]
            };
            await createOrder(orderDetails.supplierId, orderDetails.products);
        } else {
            console.log(`No suitable supplier found for stock item ID: ${stockItemId}`);
            try {
                const alert = await Alert.create({
                    type: 'No Suitable Supplier',
                    message: `No suitable supplier found for stock item ID: ${stockItemId}`,
                    stockItemId: stockItemId
                });
                console.log('Alert created:', alert); // לוג הצלחה
            } catch (error) {
                console.error('Error creating alert:', error); // לוג שגיאה
            }
        }
    } catch (error) {
        console.error('Error in checkAndOrder:', error);
    }
}

// async function findBestSupplier(supplierProducts) { // הפונקציה יכולה להיות async אם היא מבצעת פעולות אסינכרוניות
//     if (!supplierProducts || !Array.isArray(supplierProducts) || supplierProducts.length === 0) {
//         console.log("Warning: Empty or invalid supplierProducts array in findBestSupplier.");
//         return null;
//     }

//     for (const sp of supplierProducts) {
//         const supplier = await Supplier.findById(sp.supplierId);
//         if (supplier && supplier.goodsList) {
//             if (supplier.goodsList.some(productId => productId && productId.equals(sp.product))) {
//                 return sp; // פשוט מחזירים את הספק הראשון שמספק את המוצר
//             }
//         }
//     }

//     console.log("No suitable supplier found based on the current data structure.");
//     return null;
// }
async function findBestSupplier(supplierProducts) {
    if (!supplierProducts || !Array.isArray(supplierProducts) || supplierProducts.length === 0) {
        console.log("Warning: Empty or invalid supplierProducts array in findBestSupplier.");
        return null;
    }

    let bestSupplierInfo = null;

    for (const sp of supplierProducts) {
        const supplierId = sp.supplierId;
        const productId = sp.product;

        // שלוף את פרטי המוצר כדי לקבל את המחיר
        const productDetails = await Product.findById(productId);

        if (productDetails) {
            // אם עדיין אין ספק טוב, או שהמחיר של המוצר מספק נוכחי נמוך יותר
            if (!bestSupplierInfo || productDetails.price < bestSupplierInfo.productDetails.price) {
                bestSupplierInfo = {
                    supplierId: supplierId,
                    product: productId,
                    productDetails: productDetails // שמירת פרטי המוצר (כולל מחיר)
                };
            }
        }
    }

    return bestSupplierInfo;
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
    checkAndOrder,
    createOrder,
    findBestSupplier,
    readSalesData
};