const db = require('../config/db');

const addProduct = (req, res) => {
  const { name, description, price, stock, image } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  const query = `
    INSERT INTO products (name, description, price, stock, image)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [name, description, price, stock, image], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(201).json({
      message: 'Product added successfully',
      productId: result.insertId
    });
  });
};

const getProducts = (req, res) => {
  const query = 'SELECT * FROM products';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.json(results);
  });
};

const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, image } = req.body;

  const query = `
    UPDATE products
    SET name=?, description=?, price=?, stock=?, image=?
    WHERE id=?
  `;

  db.query(
    query,
    [name, description, price, stock, image, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.json({ message: 'Product updated successfully' });
    }
  );
};

const deleteProduct = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM products WHERE id=?';

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.json({ message: 'Product deleted successfully' });
  });
};

module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct
};