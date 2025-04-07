const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
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
  // unit: {
  //   type: String,
  //   enum: ['יחידות', 'קרטונים', 'ק"ג', 'ליטרים', 'אחר'],
  //   required: true,
  // },
  suppliers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  }],
});

module.exports = mongoose.model('Stock', stockSchema);