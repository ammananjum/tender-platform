// backend/controllers/serviceController.js
const db = require('../db');

// ✅ Add new service (Protected)
exports.addService = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Service name is required" });
    }

    const company = await db('companies').where({ user_id: userId }).first();
    if (!company) {
      return res.status(400).json({ message: "Create your company profile first" });
    }

    const [serviceId] = await db('goods_and_services').insert({
      name,
      description,
      company_id: company.id,
      created_at: new Date(),
      updated_at: new Date()
    }).returning('id');

    res.status(201).json({ message: "Service added", serviceId });
  } catch (error) {
    console.error("❌ Add service error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all services for current company (Protected)
exports.getMyServices = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const company = await db('companies').where({ user_id: userId }).first();

    if (!company) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    const services = await db('goods_and_services')
      .where({ company_id: company.id })
      .orderBy('created_at', 'desc');

    res.status(200).json(services);
  } catch (error) {
    console.error("❌ Fetch services error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete a service (Protected)
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;

    const company = await db('companies').where({ user_id: userId }).first();
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const service = await db('goods_and_services')
      .where({ id, company_id: company.id })
      .first();

    if (!service) {
      return res.status(404).json({ message: "Service not found or not yours" });
    }

    await db('goods_and_services').where({ id }).del();
    res.status(200).json({ message: "Service deleted" });
  } catch (error) {
    console.error("❌ Delete service error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
