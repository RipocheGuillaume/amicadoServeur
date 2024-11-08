const express = require('express');
const router = express.Router();
const pool = require('../pool'); 
const authenticateToken=require('../middelware/authenticateToken');


//Liste de tous les photos
router.get('/', async (req, res) => {
    try {
    const result = await pool.query(`SELECT 
            pictures.id,
            pictures.title,
            pictures.url,
            pictures.event_id,
            events.event
        FROM 
            pictures
        LEFT JOIN 
            events ON pictures.event_id = events.id
    `);
    const totalCount = result.rows.length;

    res.setHeader('Content-Range', `pictures 0-${totalCount - 1}/${totalCount}`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des photos', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

//Récupération d'une photo
router.get('/:id', async (req, res) => {
  const {id}=req.params
  try {
  // Filtrer les chansons en fonction de l'année
  const result = await pool.query(`SELECT 
            pictures.id,
            pictures.title,
            pictures.url,
            pictures.event_id,
            events.event
        FROM 
            pictures
        LEFT JOIN 
            events ON pictures.event_id = events.id
        WHERE
            pictures.id = $1`,[id]
    );
  const totalCount = result.rows.length;

  res.setHeader('Content-Range', `pictures 0-${totalCount - 1}/${totalCount}`);
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
  res.json(result.rows[0]);
} catch (error) {
  console.error('Erreur lors de la récupération d\'une photo', error);
  res.status(500).json({ error: 'Erreur serveur' });
}
});


//Création d'une photo
router.post('/',authenticateToken, async (req, res) => {
  const { title,url,event_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO pictures (title,url,event_id) VALUES ($1,$2,$3) RETURNING *',
      [title,url,event_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création d\'une photo', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

//Suppression d'une photo
router.delete('/:id',authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM pictures WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Photo non trouvée' });
    }
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la suppresion d\'une photo', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


//Modification d'une photo
router.patch('/:id',authenticateToken, async (req, res) => {
  const { id } = req.params;
  const {title,url}= req.body
  try {
    const result = await pool.query(
      'UPDATE pictures SET title = $1, url = $2 , updated_at = NOW() WHERE id = $3 RETURNING *',
      [title,url,id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Photo non trouvée' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création d\'une photo', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;