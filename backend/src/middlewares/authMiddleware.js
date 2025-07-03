const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 🔐 Ensure token is present
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('❌ No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('❌ JWT_SECRET is not defined in your environment');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    console.log('✅ Token verified for:', decoded.email || decoded.userId);
    req.user = {
  userId: decoded.userId || decoded.id,
  email: decoded.email
};

    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error('❌ Invalid or expired token:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
