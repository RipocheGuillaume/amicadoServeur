const express = require('express');
const router = express.Router();
const pool = require('../pool'); 

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        years.id AS id, 
        years.year, 
        COALESCE(
          ARRAY_AGG(json_build_object(
            'id', song.id,
            'title', song.title,
            'author', song.author,
            'image', song.image,
            'years_id',song.years_id
          )) FILTER (WHERE song.id IS NOT NULL), 
          '{}'::json[]
        ) AS songs
      FROM 
        years 
      LEFT JOIN 
        song ON years.id = song.years_id 
      GROUP BY 
        years.id, years.year
    `);
    res.setHeader('Content-Range', `years 0-${result.length - 1}/${result.length}`);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'année', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/:id', async (req, res) => {
  const {id}=req.params;
  try {
    const result = await pool.query('SELECT * FROM years WHERE id = $1',[id]);
    res.setHeader('Content-Range', `years 0-${result.rows.length - 1}/${result.rows.length}`);
    res.json(result.rows[0]);
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

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {year}= req.body
  try {
    const result = await pool.query(
      'UPDATE years SET year = $1 WHERE id = $2',
      [year,id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de l\'année', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM years WHERE id = $1 RETURNING *',
      [id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'année', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;