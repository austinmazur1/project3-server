const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const Buyer = require("../models/Buyer.model")
const Seller = require("../models/Seller.model");

const fileUploader = require("../config/cloudinary.config");

const upload = fileUploader.single("imageUrl");

const { isAuthenticated } = require("../middleware/jwt.middleware");



router.get("/seller/dashboard", async (req, res, next) => {
  try {
    const userId = req.query.userId;

    const products = await Product.find({ seller: userId });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get("/buyer/dashboard", async (req, res, next) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    next(error);
  }
});

//TODO display specific product
router.get("/buyer/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    const bidderId = product.currentBidder
    const currentBidder = await Buyer.findById(bidderId);
    const sellerId = product.seller;

    const seller = await Seller.findById(sellerId);

// timer
    const now = new Date().getTime();
    const expirationDate = product.createdAt.getTime() + product.duration * 1000;
    const remainingTime = Math.max(expirationDate - now, 0)

    const remainingTimer = Math.max(product.timer - Math.floor(remainingTime / 1000), 0);


    res.json({ product, seller, currentBidder, remainingTime, remainingTimer });
  } catch (error) {
    next(error);
  }
});

router.get('/seller/:id', async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    
    const bidderId = product.currentBidder
    const currentBidder = await Buyer.findById(bidderId);
    // console.log(currentBidder)

    // timer
    const now = new Date().getTime();
    const expirationDateInMilliseconds = product.createdAt.getTime() + product.duration * 60 * 1000;
    // const remainingTime = Math.max(expirationDate - now, 0)

    // const elapsedTime = now - product.createdAt.getTime();
    // const remainingTimer = Math.max(product.timer - Math.floor(elapsedTime / 1000), 0);

    res.json({product, currentBidder, expirationDateInMilliseconds})
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

router.put("/buyer/:id", async (req, res, next) => {
  try{
  const productId = req.params.id;
    const buyerData = req.body.buyer;
    console.log(buyerData)
    console.log(productId)


    const product = await Product.findById(productId);

    if(!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.buyer = buyerData;
    product.sold = true;
    product.soldAt = new Date.now()

    await product.save();

    return res.json({message: "Winner updated successfully", product: product })
  } catch(error) {
    console.log(error)
    next(error)
  }
})

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
