const router = require("express").Router();
 
const mongoose = require("mongoose");
 
const Product = require("../models/Product.model");

 
//  POST /api/projects  -  Creates a new product

router.post("/seller/new-product", (req, res, next) => {
  const { producttName, description, startingPrice, duration, images } = req.body;
 
  Product.create({ producttName, description, startingPrice, duration, images})
    .then(response => res.json(response))
    .catch(err => res.json(err));
});
 
module.exports = router;