const { Schema, model } = require("mongoose");
const mongoose = require("mongoose")

const messageSchema = new Schema({
    question: {
        type: String,
        ref: "buyer"
    },
    answer: {
        type: String,
        ref: "seller"
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: "product",
        required: true
    }
})


const Message = model("Message", messageSchema);

module.exports = Message;
