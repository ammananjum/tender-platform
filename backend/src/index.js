const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route imports
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require('./routes/companyRoutes');
const usersRoutes = require('./routes/usersRoutes');
const tenderRoutes = require('./routes/tenderRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
// Route usage
app.use("/api/auth", authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/services', serviceRoutes);
// Basic test route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// DB connection test using knex.raw()
const db = require("./db");

db.raw("SELECT NOW()")
  .then((result) => {
    console.log("Connected to DB at:", result.rows[0].now);
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
