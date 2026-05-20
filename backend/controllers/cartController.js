const db = require('../config/db');

const addToCart = (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body || {};

  if (!product_id) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  const checkQuery = `
    SELECT * FROM cart
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(checkQuery, [userId, product_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.length > 0) {
      const updateQuery = `
        UPDATE cart
        SET quantity = quantity + ?
        WHERE user_id = ? AND product_id = ?
      `;

      db.query(
        updateQuery,
        [quantity || 1, userId, product_id],
        (err2) => {
          if (err2) {
            return res.status(500).json({ message: err2.message });
          }

          return res.json({ message: 'Cart updated successfully' });
        }
      );
    } else {
      const insertQuery = `
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES (?, ?, ?)
      `;

      db.query(
        insertQuery,
        [userId, product_id, quantity || 1],
        (err2, insertResult) => {
          if (err2) {
            return res.status(500).json({ message: err2.message });
          }

          return res.status(201).json({
            message: 'Product added to cart',
            cartId: insertResult.insertId
          });
        }
      );
    }
  });
};

const getCart = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT cart.id, cart.quantity, products.name, products.price, products.image
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.json(results);
  });
};

const updateCartQuantity = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { quantity } = req.body || {};

  if (quantity === undefined || quantity === null) {
    return res.status(400).json({ message: 'Quantity is required' });
  }

  if (Number(quantity) <= 0) {
    const deleteQuery = `DELETE FROM cart WHERE id = ? AND user_id = ?`;

    db.query(deleteQuery, [id, userId], (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      return res.json({ message: 'Item removed from cart' });
    });

    return;
  }

  const updateQuery = `
    UPDATE cart
    SET quantity = ?
    WHERE id = ? AND user_id = ?
  `;

  db.query(updateQuery, [quantity, id, userId], (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.json({ message: 'Cart quantity updated successfully' });
  });
};

const removeFromCart = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const query = 'DELETE FROM cart WHERE id = ? AND user_id = ?';

  db.query(query, [id, userId], (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.json({ message: 'Item removed from cart' });
  });
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart
};