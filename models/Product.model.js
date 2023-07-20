const { Schema, model } = require("mongoose");
const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startingPrice: {
      type: Number,
      required: true,
    },
    currentPrice: {
      type: Number,
    },
    duration: {
      type: Number,
      default: 300,
      required: true,
    },
    timer: {
      type: Number,
      default: 300,
    },
    //we don't know if we need this one haha
    soldAt: {
      type: Date,
    },
    // updated for single image
    imageUrl: {
      type: String,
      required: true
    },
    //this is for the timer
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
      type: mongoose.Types.ObjectId,
      ref: 'seller',
    },
    buyer: {
      type: mongoose.Types.ObjectId,
      ref: 'buyer',
    },
    currentBidder: {
      type: mongoose.Types.ObjectId,
      ref: 'buyer',
    },
    /*bids: [
      {
        buyer: {
          type: mongoose.Types.ObjectId,
          ref: 'buyer',
          // required: true,
        },
        amount: {
          type: Number,
          // required: true,
        },
        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],*/
  },
  { timestamps: true }
);


const Product = model("Product", productSchema);

module.exports = Product;