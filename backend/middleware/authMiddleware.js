const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        id: decoded.userId,
        role: decoded.role,
      };

      next(); 
    } catch (error) {
      return res.status(401).json({ message: 'Token invalide' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Pas de token, accès refusé' });
  }
};
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Non autorisé" });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Accès interdit" });
  next();
};
module.exports = { protect, authorize };
