const express = require('express');
const router = express.Router();
const pool = require('../pool'); 

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, year FROM years');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'année', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/', async (req, res) => {
  const { year } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO years (year) VALUES ($1) RETURNING *',
      [year]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de l\'année', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;