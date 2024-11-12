const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../pool'); 
const authenticateToken=require('../middelware/authenticateToken');


router.get("/verify-token", authenticateToken, (req, res) => {
  // Si le token est valide, renvoie les informations de l'utilisateur
  res.json({ user: req.user });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    const user = result.rows[0];

    if (user) {
      // Génération du token JWT
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
      // Supprimez le mot de passe avant d'envoyer la réponse
      delete user.password;
      res.json({user,token});
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;