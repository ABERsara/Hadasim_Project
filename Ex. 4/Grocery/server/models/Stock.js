const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true, // מק"ט או ברקוד
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
  unit: {
    type: String,
    enum: ['יחידות', 'קרטונים', 'ק"ג', 'ליטרים', 'אחר'],
    required: true,
  },
  suppliers: [{
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
});

module.exports = mongoose.model('Stock', stockSchema);