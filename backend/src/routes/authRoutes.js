// src/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Register route
router.post("/register", authController.registerUser);

// Login route
router.post("/login", authController.loginUser);

// ✅ Protected route for testing token
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router;
