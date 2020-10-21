const jwt = require('jsonwebtoken');
const models = require('../models/sauces');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const user = await models.User.findOne({ where: { user_id: decodedToken.user_id } })
    if (!user) {
      throw 'Invalid user ID';
    } else {
      req.user = user
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};