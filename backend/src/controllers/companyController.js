const db = require('../db');
const supabase = require('../lib/supabase');


// ✅ Create company profile (Protected)
exports.createCompany = async (req, res) => {
  try {
    const { userId } = req.user;

    const { name, industry, description, logo_url } = req.body;

    if (!name || !industry) {
      return res.status(400).json({ message: 'Name and industry are required' });
    }

    // Check if user already has a company profile
    const existing = await db('companies').where({ user_id: userId }).first();
    if (existing) {
      return res.status(400).json({ message: 'Company profile already exists' });
    }

    await db('companies').insert({
      user_id: userId,
      name,
      industry,
      description,
      logo_url,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({ message: 'Company profile created successfully' });
  } catch (error) {
    console.error('❌ Error creating company:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Get company by ID (Public)
exports.getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await db('companies').where({ id }).first();

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error('❌ Error fetching company:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Update company (Protected)
// ✅ Update company (Protected)
exports.updateCompany = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId; // ✅ Fix destructuring

    const { name, industry, description } = req.body;

    if (!name || !industry) {
      return res.status(400).json({ message: 'Name and industry are required' });
    }

    const existingCompany = await db('companies').where({ user_id: userId }).first();
    if (!existingCompany) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    await db('companies')
      .where({ user_id: userId })
      .update({
        name,
        industry,
        description,
        updated_at: new Date()
      });

    res.status(200).json({ message: 'Company profile updated successfully' });

  } catch (error) {
    console.error('❌ Error updating company:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Delete company (Protected)

// ✅ Delete company (Protected)
exports.deleteCompany = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    // ✅ Ensure company exists before deleting
    const company = await db('companies').where({ user_id: userId }).first();
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // ✅ Perform delete
    await db('companies').where({ user_id: userId }).del();

    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting company:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 📚 Search Companies by name, industry or services
// controllers/companyController.js

exports.searchCompanies = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Step 1: Find matching companies
    const companies = await db('companies')
      .leftJoin('goods_and_services as gs', 'companies.id', 'gs.company_id')
      .where(function () {
        this.where('companies.name', 'ilike', `%${query}%`)
          .orWhere('companies.industry', 'ilike', `%${query}%`)
          .orWhere('gs.name', 'ilike', `%${query}%`);
      })
      .select(
        'companies.id',
        'companies.name',
        'companies.industry',
        'companies.description',
        'companies.user_id',
        'companies.logo_url'
      )
      .groupBy('companies.id');

    // Step 2: Attach services for each company
    for (let company of companies) {
      const services = await db('goods_and_services')
        .where({ company_id: company.id })
        .pluck('name');
      company.services = services;
    }

    res.status(200).json(companies);
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//logo

exports.uploadLogo = async (req, res) => {
  try {
    console.log('🟡 Uploading logo...');
console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Supabase Key:', process.env.SUPABASE_ANON_KEY?.slice(0, 10)); // mask key
    const userId = req.user.id || req.user.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileName = `company_${userId}_${Date.now()}.jpg`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('company-logos')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ message: 'Upload failed' });
    }

    // Generate public URL
    const logoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/company-logos/${fileName}`;

    // Save URL to DB
    await db('companies')
      .where({ user_id: userId })
      .update({
        logo_url: logoUrl,
        updated_at: new Date(),
      });

    res.status(200).json({
      message: 'Logo uploaded successfully',
      logo_url: logoUrl,
    });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// ✅ Get all companies (Public)
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await db('companies')
      .select('id', 'name', 'industry', 'description', 'logo_url','user_id');

    for (let company of companies) {
      const services = await db('goods_and_services')
        .where({ company_id: company.id })
        .pluck('name');
      company.services = services;
    }

    res.status(200).json(companies);
  } catch (error) {
    console.error('❌ Error fetching all companies:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.getMyCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const company = await db('companies').where({ user_id: userId }).first();

    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error('❌ Error fetching my company profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
