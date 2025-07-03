// backend/routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const serviceController = require('../controllers/serviceController');

// Protected routes
router.post('/', authMiddleware, serviceController.addService);
router.get('/', authMiddleware, serviceController.getMyServices);
router.delete('/:id', authMiddleware, serviceController.deleteService);

module.exports = router;
