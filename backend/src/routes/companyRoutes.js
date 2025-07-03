const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const companyController = require('../controllers/companyController');
const upload = require('../middlewares/upload'); 

// ✅ Create or update company profile (protected)
router.post('/', authMiddleware, companyController.createCompany);
// ✅ Get all companies (Public)
router.get('/', companyController.getAllCompanies);

router.get('/search', companyController.searchCompanies);
router.get('/my-profile', authMiddleware, companyController.getMyCompanyProfile);
// ✅ Get a company by ID (public)
router.get('/:id', companyController.getCompanyById);

// ✅ Update company (protected)
router.put('/update', authMiddleware, companyController.updateCompany);


// ✅ Delete company (protected)
router.delete('/delete', authMiddleware, companyController.deleteCompany);
// GET /api/companies/search?q=...

router.post('/upload-logo', authMiddleware, upload.single('file'), companyController.uploadLogo);



module.exports = router;
