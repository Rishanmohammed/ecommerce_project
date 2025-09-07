const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Register Page
router.get("/register", (req, res) => {
  res.render("auth/register", { layout: "user-layout" });
});

// Register Handle
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  let errors = [];

  if (!name || !email || !password) {
    errors.push({ msg: "Please fill in all fields" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("auth/register", {
      errors,
      name,
      email,
      password,
      layout: "user-layout"
    });
  } else {
    try {
      let user = await User.findOne({ email: email });
      if (user) {
        errors.push({ msg: "Email already registered" });
        res.render("auth/register", { errors, name, email, password, layout: "user-layout" });
      } else {
        const newUser = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();
        req.flash("success_msg", "You are now registered, please log in");
        res.redirect("/auth/login");
      }
    } catch (err) {
      console.error(err);
      res.send("Error registering user");
    }
  }
});

// Login Page
router.get("/login", (req, res) => {
  res.render("auth/login", { layout: "user-layout" });
});

// Login Handle (basic for now)
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

    // Save user in session
    req.session.user = user;

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

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

module.exports = router;
