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
  const products = await Product.find().lean();  // ✅ lean() here
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

// Show edit form
router.get("/products/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    res.render("admin/edit-product", { layout: "admin-layout", product });
  } catch (err) {
    console.error(err);
    res.send("Error loading edit form");
  }
});

// Handle edit form submit
router.post("/products/edit/:id", async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { name, description, price, image });
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    res.send("Error updating product");
  }
});

router.get("/products/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    res.send("Error deleting product");
  }
});




module.exports = router;
