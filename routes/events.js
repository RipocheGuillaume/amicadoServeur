const express = require('express');
const router = express.Router();
const pool = require('../pool'); 
const authenticateToken=require('../middelware/authenticateToken');


//Liste de tous les évenements
router.get('/', async (req, res) => {
    try {
    // Filtrer les chansons en fonction de l'année
    const result = await pool.query(`SELECT
    events.id,
    events.event,
    COALESCE(
        JSON_AGG(
            json_build_object(
                'picture_id', pictures.id,
                'title', pictures.title,
                'url', pictures.url
            )
        ) FILTER (WHERE pictures.id IS NOT NULL),
        '[]'
    ) AS pictures
FROM
    events
LEFT JOIN
    pictures ON pictures.event_id = events.id
GROUP BY
    events.id
      `);
    const totalCount = result.rows.length;

    res.setHeader('Content-Range', `events 0-${totalCount - 1}/${totalCount}`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des évenements', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

//Récupération d'un évenement
router.get('/:id', async (req, res) => {
  const {id}=req.params
  try {
  // Filtrer les chansons en fonction de l'année
  const result = await pool.query(`SELECT
    events.id,
    events.event,
    COALESCE(
        JSON_AGG(
            json_build_object(
                'picture_id', pictures.id,
                'title', pictures.title,
                'url', pictures.url
            )
        ) FILTER (WHERE pictures.id IS NOT NULL),
        '[]'
    ) AS pictures
FROM
    events
LEFT JOIN
    pictures ON pictures.event_id = events.id
WHERE events.id = $1
GROUP BY
    events.id
     `,[id]);
  const totalCount = result.rows.length;

  res.setHeader('Content-Range', `years 0-${totalCount - 1}/${totalCount}`);
  res.json(result.rows[0]);
} catch (error) {
  console.error('Erreur lors de la récupération de l\évenement', error);
  res.status(500).json({ error: 'Erreur serveur' });
}
});


//Création d'un évenement
router.post('/',authenticateToken, async (req, res) => {
  const { event } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO events (event) VALUES ($1) RETURNING *',
      [event]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de l\'evenement', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

//Suppression d'un evenement
router.delete('/:id',authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Evenement non trouvée' });
    }
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la suppresion de l\évenement', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


//Modification d'un evenement
router.patch('/:id',authenticateToken, async (req, res) => {
  const { id } = req.params;
  const {event}= req.body
  try {
    const result = await pool.query(
      'UPDATE events SET event = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [event,id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Evenement non trouvée' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de l\'évenement', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;