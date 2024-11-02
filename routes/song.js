const express = require('express');
const router = express.Router();
const pool = require('../pool'); 


router.get('/:id', async (req, res) => {
  const yearId = req.params.id;

  try {
    // Filtrer les chansons en fonction de l'année
    const result = await pool.query(
      'SELECT * FROM song WHERE years_id = $1', // Filtrer avec `years_id`
      [yearId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des chansons', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/:id', async (req, res) => {
  const { title, author, image } = req.body;
  const {id} = req.params
  try {
    const result = await pool.query(
      'INSERT INTO song (title, author, image, years_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, author, image, id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de la chanson', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;