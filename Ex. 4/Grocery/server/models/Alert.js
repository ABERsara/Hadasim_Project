const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ['No Suppliers', 'No Suitable Supplier', 'Low Stock', 'Other'] 
        },
        message: {
            type: String,
            required: true
        },
        stockItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stock' 
        },
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Supplier' 
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' 
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order' 
        },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'Resolved', 'Dismissed'],
            default: 'Pending'
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);