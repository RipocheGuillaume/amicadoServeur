const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

router.get("/verify-token", authenticateToken, (req, res) => {
  // Si le token est valide, renvoie les informations de l'utilisateur
  res.json({ user: req.user });
});

module.exports = router;
