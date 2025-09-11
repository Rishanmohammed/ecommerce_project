const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cartRoutes = require("./routes/cart");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session
app.use(session({
  secret: "ecommerce-secret",
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// Global Flash Messages + User + Cart
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");

  // ✅ Make user & cart available in all views
  res.locals.user = req.session.user || null;
  res.locals.cart = req.session.cart || [];
  next();
});

// Handlebars
const hbs = exphbs.create({
  extname: ".hbs",
  defaultLayout: "user-layout",
  layoutsDir: __dirname + "/views/layout/",
  partialsDir: __dirname + "/views/partials/",
  helpers: {
    multiply: (a, b) => a * b
  }
});

// Register handlebars engine
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// Routes
app.use("/", require("./routes/user"));
app.use("/admin", require("./routes/admin"));
app.use("/auth", require("./routes/auth"));
app.use("/cart", cartRoutes);

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
