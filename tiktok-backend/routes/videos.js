const express = require('express');
const router = express.Router();
const db = require('../models/db');
const multer = require('multer');

// Configuration Multer pour les vidéos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/videos/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Upload de vidéo
router.post('/upload', upload.single('video'), (req, res) => {
    const { user_id, caption } = req.body;
    const video_url = req.file ? `/videos/${req.file.filename}` : '';

    const sql = 'INSERT INTO videos (user_id, video_url, caption) VALUES (?, ?, ?)';
    db.query(sql, [user_id, video_url, caption], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Vidéo téléchargée.');
    });
});

// Récupération de toutes les vidéos
router.get('/', (req, res) => {
    db.query('SELECT * FROM videos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

module.exports = router;

