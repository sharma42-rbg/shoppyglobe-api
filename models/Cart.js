const mongoose = require('mongoose');

// Cart Schema for shopping cart items
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries
cartSchema.index({ userId: 1 });

module.exports = mongoose.model('Cart', cartSchema);
