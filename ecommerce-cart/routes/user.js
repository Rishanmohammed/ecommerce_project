const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Homepage - show all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("user/home", { products });
  } catch (err) {
    console.error(err);
    res.send("Error loading home page");
  }
});


module.exports = router;
