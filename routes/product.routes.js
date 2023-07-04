const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");
const Product = require("../models/Product.model");

//  POST /api/projects  -  Creates a new product
router.post("/seller/new-product", (req, res, next) => {
  const { productName, description, startingPrice, duration, images } =
    req.body;
  console.log(req.body);

  Product.create({ productName, description, startingPrice, duration, images })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

module.exports = router;
