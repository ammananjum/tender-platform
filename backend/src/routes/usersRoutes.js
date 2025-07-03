// src/routes/usersRoutes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Register route
router.post('/register', usersController.registerUser);

// Login route
router.post('/login', usersController.loginUser);

module.exports = router;
