const express = require("express");
const router = express.Router();
const Product = require('../models/Product.model');
const Buyer = require('../models/Buyer.model')
const Seller = require('../models/Seller.model')

router.get("/profile/:id", async (req, res, next) => {
  const id = req.params.id
  try {
    const buyer = await Buyer.findById(id);
    if(buyer) {
      return res.json({user: buyer, userType: 'buyer'});
    }

      const seller = await Seller.findById(id);
      if(seller) {
        return res.json({user: seller, userType: 'seller'});
      }

      res.status(404).json({error: 'User not found'});
  } catch (error) {
    res.status(500).json({error: 'Internal server error'})
  }
});

router.get('/seller', (req, res, next) => {
  const sellerData = {
    name: 'John Doe',
    products: ['Product 1', 'Product 2', 'Product 3']
  };
  
  res.json(sellerData);
})

module.exports = router;
