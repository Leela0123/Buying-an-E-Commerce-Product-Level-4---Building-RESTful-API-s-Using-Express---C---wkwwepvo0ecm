const fs = require('fs');
const express = require('express');
const app = express();

// Importing products from products.json file
const products = JSON.parse(fs.readFileSync(`${__dirname}/data/products.json`));

// Middlewares
app.use(express.json());

// Endpoint to update the quantity of a product
app.patch('/api/v1/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const { quantity } = req.body;

  // Find the product in the database
  const productIndex = products.findIndex((product) => product.id === productId);

  // If the product is not found, return 404
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // If the product is found but the quantity is 0, return 404 with a message
  if (products[productIndex].quantity === 0) {
    return res.status(404).json({ message: 'Product is out of stock' });
  }

  // Reduce the quantity of the product by the requested amount
  products[productIndex].quantity -= quantity;

  // Update the products.json file with the new product data
  fs.writeFileSync(`${__dirname}/data/products.json`, JSON.stringify(products));

  // Return the updated product list
  res.status(200).json(products);
});

module.exports = app;
