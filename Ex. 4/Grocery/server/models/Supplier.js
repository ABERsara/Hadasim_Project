const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
    {
        password: {
            type: String,
            required: true
        },
        companyName: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        representativeName: {
            type: String,
            required: true
        },
        // permission: {
        //     type: String,
        //     default:'Supplier'
        // },
        goodsList: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }],
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Supplier', supplierSchema);