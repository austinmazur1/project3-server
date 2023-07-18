const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");
const Product = require("../models/Product.model");
const Seller = require("../models/Seller.model");
const multer = require("multer");

const fileUploader = require("../config/cloudinary.config");

const upload = fileUploader.single("imageUrl");

const { isAuthenticated } = require("../middleware/jwt.middleware");

//  GET /seller/dashboard  -  Shows all the products

/*router.get("/seller/dashboard", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;
  Seller.findById(userId).then();
  Product.find({ userId })
    .then((allProductsFromUser) => res.json(allProductsFromUser))
    .catch((err) => res.json(err));
});
*/

router.get("/seller/dashboard/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const products = await Product.find({ seller: userId });
    res.json(products);
  } catch (error) {
    next(error);
  }
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
    const productId = req.params.id;
    console.log(productId);
    const product = await Product.findById(productId);
    const sellerId = product.seller;

    const seller = await Seller.findById(sellerId);

    res.json({ product, seller });
  } catch (error) {
    next(error);
  }
});

//route that recieves an image and send to cloudinary via fileUploaded, returns url
router.post("/upload", upload, (req, res, next) => {
  console.log("file is", req.file);

  if (!req.file) {
    res.status(400).json({ error: "No image uploaded" });
  } else {
    res.json({ fileUrl: req.file.path });
  }
});

//  POST /api/projects  -  Creates a new product
router.post("/seller/new-product", isAuthenticated, (req, res, next) => {
  const { productName, description, startingPrice, duration, imageUrl } =
    req.body;
  console.log("body", req.body);
  const userId = req.payload._id;

  console.log("imageUrl", imageUrl);

  Product.create({
    productName,
    description,
    startingPrice,
    duration,
    seller: userId,
    imageUrl,
  })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => res.json(err));
});

module.exports = router;
