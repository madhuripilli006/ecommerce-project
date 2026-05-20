const db = require('../config/db');

const placeOrder = (req, res) => {
  const userId = req.user.id;

  const cartQuery = `
    SELECT cart.product_id, cart.quantity, products.price
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  db.query(cartQuery, [userId], (err, cartItems) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    cartItems.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });

    const orderQuery = `
      INSERT INTO orders (user_id, total_amount, status)
      VALUES (?, ?, 'Pending')
    `;

    db.query(orderQuery, [userId, totalAmount], (err, orderResult) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      const orderId = orderResult.insertId;

      const orderItemsQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ?
      `;

      const orderItemsData = cartItems.map((item) => [
        orderId,
        item.product_id,
        item.quantity,
        item.price
      ]);

      db.query(orderItemsQuery, [orderItemsData], (err) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        const clearCartQuery = 'DELETE FROM cart WHERE user_id = ?';

        db.query(clearCartQuery, [userId], (err) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }

          res.status(201).json({
            message: 'Order placed successfully',
            orderId,
            totalAmount
          });
        });
      });
    });
  });
};

const getOrders = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT * FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.json(results);
  });
};

module.exports = {
  placeOrder,
  getOrders
};