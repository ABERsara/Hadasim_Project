const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Supplier',
            required: true
        },
        products: {
            type: [
                {
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Product',
                        required: true
                    },
                    quantity: {
                        type: Number,
                        required: true
                    }
                }
            ],
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'inProgress', 'completed'],
            default: 'pending'
        },
        orderDate: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);