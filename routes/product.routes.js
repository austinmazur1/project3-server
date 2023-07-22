const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const Buyer = require("../models/Buyer.model")
const Seller = require("../models/Seller.model");

const fileUploader = require("../config/cloudinary.config");

const upload = fileUploader.single("imageUrl");

const { isAuthenticated } = require("../middleware/jwt.middleware");



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
      console.log("includes Seller?",false);
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
    const bidderId = product.currentBidder
    const currentBidder = await Buyer.findById(bidderId);
    const sellerId = product.seller;

    const seller = await Seller.findById(sellerId);

    res.json({ product, seller, currentBidder });
  } catch (error) {
    next(error);
  }
});

router.get('/seller/:id', async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
console.log(product)
    
    const bidderId = product.currentBidder
    const currentBidder = await Buyer.findById(bidderId);
    console.log(currentBidder)

    res.json({product, currentBidder})
  } catch (error) {
    next(error)
  }
})

// TODO fix update
// Update product
// router.post('/seller/:id', async (req, res, next) => {
//   try {
//     const productId = req.params.id;
//     const { productName, description } = req.body 
//     console.log(productName)
//     console.log('productId', productId)
//     console.log('updates', req.body)
//     const updatedProduct = await Product.findByIdAndUpdate(productId, {productName, description}, {new: true})

//     if(!updatedProduct) {
//       return res.status(404).json({error: 'Product not found'})
//     }
//     res.json(updatedProduct)
//   } catch (error) {
//     next(error)
//   }
// })

//  Delete product
router.delete('/seller/:id', async (req, res, next) => {
  try {
    const productId = req.params.id;
    await Product.findByIdAndDelete(productId);
    if(!productId) {
      return res.status(404).json({error: 'Product not found'})
    }

    res.status(200).json({success: "Product deleted"})
  } catch (error) {
    next(error)
  }
})

// POST - Place a bid

router.post("/buyer/:id",  async (req, res, next ) => {
  const productId = req.params.id;
  console.log(req.body)
  const { currentPrice, currentBidder } = req.body;
  const priceToNumber = parseInt(currentPrice)

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  if(priceToNumber <= product.currentPrice || priceToNumber <= product.startingPrice) {
    return res.status(400).json({message: 'Bid must be higher than the current price.'})
  }

  product.currentPrice = priceToNumber;
  product.currentBidder = currentBidder;

  await product.save();

  return res.status(200).json({ message: "Bid placed successfully.", product });
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
