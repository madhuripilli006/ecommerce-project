const express = require('express');
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart
} = require('../controllers/cartController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.put('/update/:id', authMiddleware, updateCartQuantity);
router.delete('/remove/:id', authMiddleware, removeFromCart);

module.exports = router;