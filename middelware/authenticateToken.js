const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401).json({message:"Token manquant"}); // Non autorisé si aucun token
  
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403).json({message:"Token invalide ou expiré"}); // Accès refusé si token invalide ou expiré
      req.user = user;
      next();
    });
  }

  module.exports = authenticateToken;