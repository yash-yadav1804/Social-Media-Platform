const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token, access denied' 
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user and verify token
    const user = await User.findOne({
      _id: decoded.id
    }).select('-password');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found, token invalid' 
      });
    }

    // Add token and user to the request
    req.token = token;
    req.user = user;
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

module.exports = auth;
