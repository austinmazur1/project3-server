const { Schema, model } = require("mongoose");
const mongoose = require("mongoose")

const sellerSchema = new Schema(
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
    postedProducts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product"
      }
    ],
    soldProducts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product"
      }
    ],
    message: [{
        type: mongoose.Types.ObjectId,
        ref: "message",
    }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Seller = model("Seller", sellerSchema);

module.exports = Seller;
