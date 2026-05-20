const express = require('express');
const router = express.Router();

const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', getProducts);

router.post(
  '/add',
  authMiddleware,
  adminMiddleware,
  addProduct
);

router.put(
  '/update/:id',
  authMiddleware,
  adminMiddleware,
  updateProduct
);

router.delete(
  '/delete/:id',
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

module.exports = router;