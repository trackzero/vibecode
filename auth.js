const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secretkey';

function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role, teamId: user.teamId }, SECRET, { expiresIn: '1h' });
}

function authenticate(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Missing token' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function authorize(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

module.exports = { generateToken, authenticate, authorize };
