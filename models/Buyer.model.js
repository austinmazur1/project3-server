const { Schema, model } = require("mongoose");
const mongoose = require("mongoose")

const buyerSchema = new Schema(
  {
    address: {
      type: String,
      // required: true
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    image: {
      type: String
    },
    favouriteProducts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product"
      }
    ],
    boughtProducts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product"
      }
    ],
    buyer: {
      type: Boolean,
      required: true
    },
    message: [{
        type: mongoose.Types.ObjectId,
        ref: "message",
    }],
    bid: [{
        product: {
            type: mongoose.Types.ObjectId,
            ref: "product",
          },
          amount: {
            type: Number,
            required: true,
          },
          time: {
            type: Date,
            default: Date.now,
          },
  }]
  },
  {
    timestamps: true,
  }
);

const Buyer = model("Buyer", buyerSchema);

module.exports = Buyer;