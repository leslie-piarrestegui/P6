const jwt = require('jsonwebtoken');

exports.getDecodedToken = (req) => {
    const token = req.headers.authorization.split(' ')[1];

    return jwt.verify(token, 'RANDOM_TOKEN_SECRET');
}
