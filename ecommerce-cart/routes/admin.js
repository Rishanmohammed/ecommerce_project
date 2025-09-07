const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Show add product form
router.get("/products/add", (req, res) => {
  res.render("admin/add-product", { layout: "admin-layout" });
});

// Handle form submission
router.post("/products/add", async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const product = new Product({ name, description, price, image });
    await product.save();
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    res.send("Error adding product");
  }
});

// Show all products
router.get("/products", async (req, res) => {
  const products = await Product.find();
  res.render("admin/products", { layout: "admin-layout", products });
});
// Dashboard
router.get("/dashboard", async (req, res) => {
  try {
    // Later we’ll count products/users/orders
    res.render("admin/dashboard", { 
      layout: "admin-layout",
      productsCount: 0,
      usersCount: 0
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading dashboard");
  }
});


module.exports = router;
