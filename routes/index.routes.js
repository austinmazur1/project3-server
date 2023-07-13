const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get('/seller', (req, res, next) => {
  const sellerData = {
    name: 'John Doe',
    products: ['Product 1', 'Product 2', 'Product 3']
  };
  
  res.json(sellerData);
})

module.exports = router;
