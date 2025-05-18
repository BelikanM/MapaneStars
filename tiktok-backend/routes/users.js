const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Route de test de connexion à la base
router.get('/test-connection', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) return res.status(500).send('Erreur de connexion à la base.');
        res.send(`La connexion fonctionne. Résultat : ${results[0].solution}`);
    });
});

// Récupération de tous les utilisateurs
router.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

module.exports = router;
