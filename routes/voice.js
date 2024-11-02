const express = require('express');
const router = express.Router();
const pool = require('../pool'); 


router.get('/:year_id/:song_id', async (req, res) => {
    const yearId = req.params.year_id;
    const songId = req.params.song_id;
  
    try {
      // Sélectionner les voix pour une chanson spécifique appartenant à une année donnée
      const result = await pool.query(
        `SELECT voice.* FROM voice 
         JOIN song ON voice.song_id = song.id 
         JOIN years ON song.years_id = years.id 
         WHERE years.id = $1 AND song.id = $2`,
        [yearId, songId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des voix', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

router.post('/:song_id', async (req, res) => {
    const { voice, link } = req.body;
    const { song_id } = req.params;
  
    try {
      const result = await pool.query(
        'INSERT INTO voice (voice, link, song_id) VALUES ($1, $2, $3) RETURNING *',
        [voice, link, song_id]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la création de la voix', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

module.exports = router;