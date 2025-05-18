const db = require('../models/db');

exports.uploadVideo = (req, res) => {
    const { user_id, video_url, caption } = req.body;
    const sql = 'INSERT INTO videos (user_id, video_url, caption) VALUES (?, ?, ?)';
    db.query(sql, [user_id, video_url, caption], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Video uploaded.');
    });
};

exports.getAllVideos = (req, res) => {
    db.query('SELECT * FROM videos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};
