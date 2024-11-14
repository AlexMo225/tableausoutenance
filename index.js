const express = require('express');
const app = express();
const PORT = 3000;
const classroomsRoutes = require('./routes/classrooms');
const studentsRoutes = require('./routes/students');

// Middleware pour gérer le JSON
app.use(express.json());

// Utilisation des routes
app.use('/classrooms', classroomsRoutes);
app.use('/classrooms/:classroom_id/students', studentsRoutes);

// Route de test de base
app.get('/', (req, res) => {
    res.send('Serveur Express est en marche!');
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
