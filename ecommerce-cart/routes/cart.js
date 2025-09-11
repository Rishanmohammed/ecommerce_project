const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Initialize cart in session
function initCart(req) {
  if (!req.session.cart) req.session.cart = [];
}

// Add to Cart
router.post("/add/:id", async (req, res) => {
  initCart(req);
  const product = await Product.findById(req.params.id);

  const cartItem = req.session.cart.find(p => p._id == product._id);
  if (cartItem) {
    cartItem.qty += 1;
  } else {
    req.session.cart.push({ _id: product._id, name: product.name, price: product.price, qty: 1 });
  }

  res.redirect("/cart");
});

// View Cart
router.get("/", (req, res) => {
  initCart(req);

  const total = req.session.cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  res.render("cart", { cart: req.session.cart, total });
});

// Increment
router.post("/inc/:id", (req, res) => {
  initCart(req);
  const item = req.session.cart.find(p => p._id == req.params.id);
  if (item) item.qty += 1;
  res.redirect("/cart");
});

// Decrement
router.post("/dec/:id", (req, res) => {
  initCart(req);
  const item = req.session.cart.find(p => p._id == req.params.id);
  if (item) {
    item.qty -= 1;
    if (item.qty <= 0) req.session.cart = req.session.cart.filter(p => p._id != req.params.id);
  }
req.session.cart = cart;  // update cart
req.session.save(() => {
  res.redirect("back");
});

});

module.exports = router;
