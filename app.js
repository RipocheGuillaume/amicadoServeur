require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const songRoutes = require('./routes/song');
const yearsRoutes = require('./routes/years');
const voiceRoutes = require('./routes/voice');
const usersRoutes = require('./routes/users');
const eventsRoutes = require('./routes/events');
const picturesRoutes = require('./routes/pictures');
const pool = require('./pool'); 


// Configuration de la connexion PostgreSQL


const app = express();
const PORT = process.env.PORT ||3000;
// const USER =process.env.USER;
// const DATABASE =process.env.DATABASE;

// Test de connexion à la base de données
pool.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données', err.stack);
  } else {
    console.log('Connecté à la base de données PostgreSQL');
  }
});

app.use(cors({exposedHeaders: ['Content-Range']}));

// Middleware pour le parsing JSON
app.use(express.json());

// Route pour obtenir tous les utilisateurs
app.use('/years', yearsRoutes);
app.use('/song', songRoutes);
app.use('/voice', voiceRoutes);
app.use('/users', usersRoutes);
app.use('/events', eventsRoutes);
app.use('/pictures', picturesRoutes)

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT} ${process.env.DB_NAME}`);
});