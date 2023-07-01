const mongoose = require('mongoose');
const types = mongoose.Types;

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    startingPrice: {
      type: Number,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      default: 300,
    },
    timer: {
      type: Number,
      default: 300,
    },
    soldAt: {
      type: Date,
    },
    image: {
      type: String,
    },
    catergory: {
      type: String,
    },
    auctionStarted: {
      type: Boolean,
      default: false,
    },
    auctionEnded: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Boolean,
      default: false,
    },
    seller: {
      type: types.ObjectId,
      ref: 'seller',
    },
    buyer: {
      type: types.ObjectId,
      ref: 'buyer',
    },
    currentBidder: {
      type: types.ObjectId,
      ref: 'buyer',
    },
    bids: [
      {
        buyer: {
          type: types.ObjectId,
          ref: 'buyer',
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);


const Product = model("Product", productSchema);

module.exports = Product;