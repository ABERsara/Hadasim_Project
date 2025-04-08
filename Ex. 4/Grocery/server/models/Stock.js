const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    uniqueId: {
        type: String,
        required: true,
        unique: true,
    },
    currentQuantity: {
        type: Number,
        required: true,
        default: 0,
    },
    minimumQuantity: {
        type: Number,
        required: true,
    },
    supplierProducts: [{ 
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Supplier',
           
        },
        product: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
           
        }
    }],
});

module.exports = mongoose.model('Stock', stockSchema);