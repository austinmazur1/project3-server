const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");
const Product = require("../models/Product.model");
const multer = require("multer");

const upload = multer()

//  POST /api/projects  -  Creates a new product
router.post("/seller/new-product", upload.single("image"), (req, res, next) => {
  const { productName, description, startingPrice, duration } =
    req.body;
    const image = req.file;
  console.log(req.body);
  console.log(image)

  Product.create({ productName, description, startingPrice, duration, image: {
    data: image.buffer,
    contentType: image.mimetype
  } })
    .then((response) => {
      res.json(response)
    })
    .catch((err) => res.json(err));
});

module.exports = router;

