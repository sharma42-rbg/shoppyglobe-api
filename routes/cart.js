const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// GET /cart - Get user's cart (implied, but not in requirements - adding for completeness)
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate('products.productId', 'name price description stock');

    if (!cart) {
      return res.json({
        success: true,
        data: { userId: req.user._id, products: [] }
      });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching cart'
    });
  }
});

// POST /cart - Add product to cart
router.post('/', [
  // Validation middleware
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Check if product exists and has sufficient stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${product.stock}`
      });
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Check if product already in cart
    const existingProductIndex = cart.products.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingProductIndex > -1) {
      // Update quantity
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Add new product
      cart.products.push({ productId, quantity });
    }

    await cart.save();

    // Populate product details
    await cart.populate('products.productId', 'name price description stock');

    res.status(201).json({
      success: true,
      message: 'Product added to cart successfully',
      data: cart
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while adding to cart'
    });
  }
});

// PUT /cart/:id - Update product quantity in cart
router.put('/:id', [
  // Validation middleware
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id: productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    // Find user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find product in cart
    const productIndex = cart.products.findIndex(
      item => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }

    // If quantity is 0, remove the product
    if (quantity === 0) {
      cart.products.splice(productIndex, 1);
    } else {
      // Check stock availability
      const product = await Product.findById(productId);
      if (product && product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Available: ${product.stock}`
        });
      }

      cart.products[productIndex].quantity = quantity;
    }

    await cart.save();

    // Populate product details
    await cart.populate('products.productId', 'name price description stock');

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: cart
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating cart'
    });
  }
});

// DELETE /cart/:id - Remove product from cart
router.delete('/:id', [
  // Validation middleware
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID format')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id: productId } = req.params;
    const userId = req.user._id;

    // Find user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find product in cart
    const productIndex = cart.products.findIndex(
      item => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }

    // Remove product from cart
    cart.products.splice(productIndex, 1);
    await cart.save();

    // Populate product details
    await cart.populate('products.productId', 'name price description stock');

    res.json({
      success: true,
      message: 'Product removed from cart successfully',
      data: cart
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while removing from cart'
    });
  }
});

module.exports = router;
