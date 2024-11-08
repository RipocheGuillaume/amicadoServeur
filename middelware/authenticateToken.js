function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401); // Non autorisé si aucun token
  
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403); // Accès refusé si token invalide ou expiré
      req.user = user;
      next();
    });
  }