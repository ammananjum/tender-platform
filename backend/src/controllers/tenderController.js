const db = require('../db');

// ✅ Create Tender (Protected)
// ✅ Create Tender (Protected)
exports.createTender = async (req, res) => {
  try {
    const { title, description, budget, deadline } = req.body;
    const userId = req.user.userId || req.user.id;
    const email = req.user.email;

    if (!title || !description || !budget || !deadline) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // ✅ Step 1: Find the user's company
    const company = await db('companies').where({ user_id: userId }).first();

    if (!company) {
      return res.status(400).json({ message: 'Company profile not found. Please create one first.' });
    }

    // ✅ Step 2: Insert tender using company.id (not user.id)
    const [newTenderId] = await db('tenders')
      .insert({
        title,
        description,
        budget,
        deadline,
        company_id: company.id,  // Use the correct company ID here
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('id');

    console.log(`✅ Tender created by ${email}, Tender ID: ${newTenderId}`);
    res.status(201).json({ message: 'Tender created successfully', tenderId: newTenderId });

  } catch (error) {
    console.error('❌ Tender creation failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Get All Tenders (Public)
exports.getAllTenders = async (req, res) => {
  try {
    const tenders = await db('tenders')
      .select('id', 'title', 'description', 'budget', 'deadline', 'company_id', 'created_at')
      .orderBy('created_at', 'desc');

    res.status(200).json(tenders);
  } catch (error) {
    console.error('❌ Error fetching tenders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Apply to Tender (Protected)
exports.applyToTender = async (req, res) => {
  try {
    console.log('🔍 req.user =', req.user);

    const { tender_id, proposal } = req.body;
    const userId = req.user.userId || req.user.id;
    const email = req.user.email;

    if (!tender_id || !proposal) {
      return res.status(400).json({ message: 'Tender ID and proposal are required' });
    }

    const tender = await db('tenders').where({ id: tender_id }).first();
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }

    console.log('📌 Applying userId =', userId);

    const [newApplicationId] = await db('applications')
      .insert({
        tender_id,
        user_id: userId,
        proposal,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('id');

    console.log(`✅ ${email} applied to tender #${tender_id}, Application ID: ${newApplicationId}`);
    res.status(201).json({ message: 'Application submitted successfully', applicationId: newApplicationId });

  } catch (error) {
    console.error('❌ Application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Get Applications for a Tender (Company's Own Tender Only)
exports.getTenderApplications = async (req, res) => {
  try {
    const { tender_id } = req.params;
    const companyId = req.user.userId || req.user.id;

    if (!tender_id) {
      return res.status(400).json({ message: 'Tender ID is required' });
    }

    const tender = await db('tenders')
      .where({ id: tender_id, company_id: companyId })
      .first();

    if (!tender) {
      return res.status(403).json({ message: 'Access denied: You do not own this tender' });
    }

    const applications = await db('applications')
      .where({ tender_id })
      .join('users', 'applications.user_id', 'users.id')
      .select(
        'applications.id',
        'applications.proposal',
        'applications.created_at',
        'users.username as applicant_name',
        'users.email as applicant_email'
      )
      .orderBy('applications.created_at', 'desc');

    res.status(200).json({ tender_id, applications });

  } catch (error) {
    console.error('❌ Fetching applications failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Get Tenders the Logged-in User Has Applied To (Protected)
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const applications = await db('applications')
      .where('applications.user_id', userId)
      .join('tenders', 'applications.tender_id', 'tenders.id')
      .select(
        'applications.id as application_id',
        'applications.proposal',
        'applications.created_at as applied_at',
        'tenders.id as tender_id',
        'tenders.title',
        'tenders.description',
        'tenders.budget',
        'tenders.deadline'
      )
      .orderBy('applications.created_at', 'desc');

    res.status(200).json({ user_id: userId, applications });

  } catch (error) {
    console.error('❌ Error fetching user applications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// PUT /api/tenders/:id
exports.updateTender = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;
    const { title, description, budget, deadline } = req.body;

    const tender = await db('tenders').where({ id, company_id: userId }).first();
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found or access denied' });
    }

    await db('tenders')
      .where({ id })
      .update({
        title,
        description,
        budget,
        deadline,
        updated_at: new Date(),
      });

    res.status(200).json({ message: 'Tender updated successfully' });
  } catch (error) {
    console.error('❌ Update tender error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// DELETE /api/tenders/:id
exports.deleteTender = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;

    const tender = await db('tenders').where({ id, company_id: userId }).first();
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found or access denied' });
    }

    await db('tenders').where({ id }).del();

    res.status(200).json({ message: 'Tender deleted successfully' });
  } catch (error) {
    console.error('❌ Delete tender error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
