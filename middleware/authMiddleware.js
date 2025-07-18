const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // includes id and username
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;