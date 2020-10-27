const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authService = require('../services/auth.service');

module.exports = async (req, res, next) => {
  try {
    const userId = authService.getDecodedToken(req).userId;

    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};