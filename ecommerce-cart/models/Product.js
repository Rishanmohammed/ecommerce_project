const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String, // later we can add file upload
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
