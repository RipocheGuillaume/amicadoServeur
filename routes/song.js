const express = require('express');
const router = express.Router();
const pool = require('../pool'); 


router.get('/', async (req, res) => {
    try {
    // Filtrer les chansons en fonction de l'année
    const result = await pool.query(`
      SELECT 
    song.id AS id, 
    song.title, 
    song.author,
    song.image,
    song.years_id,
    COALESCE(
      ARRAY_AGG(json_build_object(
        'id', voice.id,
        'voice', voice.voice,
        'link', voice.link,
        'song_id', voice.song_id
      )) FILTER (WHERE voice.id IS NOT NULL), 
      '{}'::json[]
    ) AS voice
  FROM 
    years 
  LEFT JOIN 
    song ON years.id = song.years_id
  LEFT JOIN 
    voice ON song.id = voice.song_id 
  GROUP BY 
    song.id, song.title, song.author, song.image, song.years_id
    `);
    res.setHeader('Content-Range', `song 0-${result.length - 1}/${result.length}`);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des chansons', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/:id', async (req, res) => {
  const yearId = req.params.id;

  try {
    // Filtrer les chansons en fonction de l'année
    const result = await pool.query(
      'SELECT * FROM song WHERE years_id = $1', // Filtrer avec `years_id`
      [yearId]
    );
    res.setHeader('Content-Range', `song 0-${result.rows.length - 1}/${result.rows.length}`);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des chansons', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/', async (req, res) => {
  const { title, author, image, years_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO song (title, author, image, years_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, author, image, years_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de la chanson', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM song WHERE id = $1 RETURNING *',
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
  const {title,author,image,years_id}= req.body
  try {
    const result = await pool.query(
      'UPDATE song SET title = $1, author= $2, image= $3, years_id= $4 WHERE id = $5',
      [title,author,image,years_id,id]
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