const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");
const Product = require("../models/Product.model");
const Seller = require("../models/Seller.model");
const multer = require("multer");

const upload = multer();

const { isAuthenticated } = require("../middleware/jwt.middleware");

//  GET /seller/dashboard  -  Shows all the products

router.get("/seller/dashboard", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;
  Seller.findById(userId).then();
  Product.find({ userId })
    .then((allProductsFromUser) => res.json(allProductsFromUser))
    .catch((err) => res.json(err));
});

router.get("/buyer/dashboard", async (req, res, next) => {
  try {
    const products = await Product.find();
    if (products.includes("seller")) {
      console.log(true);
    } else {
      console.log(false);
    }

    res.json(products);
  } catch (error) {
    next(error);
  }
});

//TODO display specific product
router.get("/buyer/:id", async (req, res, next) => {
  try {
    const productId = req.params.id
    console.log(productId)
    const product = await Product.findById(productId)
    const sellerId = product.seller

    const seller = await Seller.findById(sellerId);

    res.json({product, seller})
  } catch (error) {
    next(error)
  }
});

//  POST /api/projects  -  Creates a new product
//TODO fix images 
router.post(
  "/seller/new-product",
  isAuthenticated,
  upload.single("image"),
  (req, res, next) => {
    const { productName, description, startingPrice, duration } = req.body;
    const image = req.file;
    const userId = req.payload._id;
    // console.log("PAYLOAD", req.payload);

    if (!image) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(image.mimetype)) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    const maxFileSize = 5 * 1024 * 1024; //5MB
    if (image.size > maxFileSize) {
      return res.status(400).json({ error: "File exceeds the limit" });
    }

    const imageFilePath = `uploads/${image.filename}`;

    Product.create({
      productName,
      description,
      startingPrice,
      duration,
      seller: userId,
      image: {
        data: imageFilePath,
        contentType: image.mimetype,
      },
    })
      .then((response) => {
        res.json(response);
      })
      .catch((err) => res.json(err));
  }
);

module.exports = router;
