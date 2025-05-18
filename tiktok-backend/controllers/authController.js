const db = require('../models/db');
const jwt = require('jsonwebtoken');

exports.googleAuth = (req, res) => {
    const { email, name, picture, google_uid } = req.body;

    const checkUserSql = 'SELECT * FROM users WHERE email = ? OR google_uid = ?';
    db.query(checkUserSql, [email, google_uid], (err, results) => {
        if (err) return res.status(500).send(err);

        if (results.length === 0) {
            const insertUserSql = 'INSERT INTO users (username, email, profile_picture, google_uid) VALUES (?, ?, ?, ?)';
            db.query(insertUserSql, [name, email, picture, google_uid], (err) => {
                if (err) return res.status(500).send(err);
            });
        }

        const token = jwt.sign({ email }, 'secretKey', { expiresIn: '1d' });
        res.json({ token });
    });
};
