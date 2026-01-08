const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ⚠️ Assure-toi que ton token contient bien userId et role
      req.user = {
        id: decoded.userId,  // ou decoded.id suivant ce que tu as mis au login
        role: decoded.role,
      };

      return next(); // ✅ très important : on sort de la fonction
    } catch (error) {
      console.error("Erreur verify JWT:", error);
      return res.status(401).json({ message: "Token invalide" });
    }
  }

  // Aucun token
  return res.status(401).json({ message: "Pas de token, accès refusé" });
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Accès interdit" });
  }

  next();
};

module.exports = { protect, authorize };
