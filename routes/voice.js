const express = require('express');
const router = express.Router();
const pool = require('../pool'); 

router.get('/', async (req, res) => {
  
    try {
      // Sélectionner les voix pour une chanson spécifique appartenant à une année donnée
      const result = await pool.query(
        `SELECT 
  voice.id,
  voice.voice,
  voice.link,
  voice.song_id,
  voice.created_at,
  voice.updated_at,
  song.id AS song_id,
  song.title,
  song.author,
  song.image,
  song.years_id,
  years.id AS years_id,
  years.year
FROM 
  voice
JOIN 
  song ON voice.song_id = song.id
JOIN 
  years ON years.id = song.years_id`);
    const totalCount = result.rows.length;

    res.setHeader('Content-Range', `years 0-${totalCount - 1}/${totalCount}`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
      res.json(result.rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des voix', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });


router.get('/:id', async (req, res) => {
    const {id} = req.params;
  
    try {
      // Sélectionner les voix pour une chanson spécifique appartenant à une année donnée
      const result = await pool.query(
        `SELECT * FROM voice 
         WHERE id = $1`,
        [id]
      );
      res.setHeader('Content-Range', `voice 0-${result.rows.length - 1}/${result.rows.length}`);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la récupération des voix', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

router.post('/', async (req, res) => {
  console.log(req.body);
    const { voice, link,song_id } = req.body;
    // const { song_id } = req.params;
  
    try {
      const result = await pool.query(
        'INSERT INTO voice (voice, link, song_id) VALUES ($1, $2, $3) RETURNING *',
        [voice, link, song_id]
      );
      console.log(result)
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la création de la voix', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        'DELETE FROM voice WHERE id = $1 RETURNING *',
        [id]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la suppresion de la chanson', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {voice, link, song_id}= req.body
    try {
      const result = await pool.query(
        'UPDATE voice SET voice = $1, link= $2, song_id= $3 WHERE id = $4',
        [voice, link, song_id,id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Chanson non trouvée' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la création de l\'année', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

module.exports = router;