const express = require('express');
const router = express.Router();

const {
  placeOrder,
  getOrders
} = require('../controllers/orderController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/place', authMiddleware, placeOrder);
router.get('/', authMiddleware, getOrders);

module.exports = router;