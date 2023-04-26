const fs = require('fs');
const express = require('express');
const app = express();


// Importing products from products.json file
const products = JSON.parse(
    fs.readFileSync(`${__dirname}/data/products.json`)
);


// Middlewares
app.use(express.json());

// PATCH endpoint to buy a product
app.patch('/api/v1/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  // find product with the given id
  const product = products.find(product => product.id === id);
  
  // if product not found, return 404 error
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  // check if product is out of stock
  if (product.quantity === 0) {
    return res.status(404).json({ message: 'Product out of stock' });
  }
  
  // update product quantity and return the updated product list
  product.quantity--;
  fs.writeFileSync(`${__dirname}/data/products.json`, JSON.stringify(products));
  res.status(200).json(products);
});


module.exports = app;
