const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'BelikanM',
    password: process.env.DB_PASSWORD || 'Dieu19961991??!??!',
    database: process.env.DB_NAME || 'tiktok_clone',
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('❌ Erreur de connexion à MySQL :', err);
    } else {
        console.log('✅ Connexion MySQL établie avec succès.');
    }
});

module.exports = db;
