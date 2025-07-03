const multer = require('multer');

// Use memory storage for direct upload to Supabase
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
