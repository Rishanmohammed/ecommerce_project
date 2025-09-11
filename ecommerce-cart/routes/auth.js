const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Login Page
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// Register Page
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// Register Handle
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  let errors = [];

  if (!name || !email || !password) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("auth/register", { errors, name, email, password });
  } else {
    try {
      let user = await User.findOne({ email: email });
      if (user) {
        errors.push({ msg: "Email already exists" });
        return res.render("auth/register", { errors, name, email, password });
      }

      const newUser = new User({ name, email, password });
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);

      await newUser.save();
      req.flash("success_msg", "You are now registered and can log in");
      res.redirect("/auth/login");
    } catch (err) {
      console.error(err);
      res.send("Error registering user");
    }
  }
});

// Login Handle
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      req.flash("error_msg", "Email not found");
      return res.redirect("/auth/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error_msg", "Invalid password");
      return res.redirect("/auth/login");
    }

    // ✅ Save plain user data in session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || "user"
    };

    req.flash("success_msg", "Logged in successfully");

    if (user.role === "admin") {
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.send("Error logging in");
  }
});

// Logout Handle
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect("/auth/login");
  });
});

module.exports = router;
