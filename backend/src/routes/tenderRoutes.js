//tenderRoutes
const express = require('express');
const router = express.Router();
const tenderController = require('../controllers/tenderController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public
router.get('/', tenderController.getAllTenders);

// Protected
router.post('/create', authMiddleware, tenderController.createTender);
router.post('/apply', authMiddleware, tenderController.applyToTender);
router.get('/:tender_id/applications', authMiddleware, tenderController.getTenderApplications);
router.get('/my-applications', authMiddleware, tenderController.getUserApplications);

router.put('/:id', authMiddleware, tenderController.updateTender);
router.delete('/:id', authMiddleware, tenderController.deleteTender);
module.exports = router;
