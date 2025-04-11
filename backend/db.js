
// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'bd_281',
    password: process.env.DB_PASSWORD || 'BaseDatos',
    port: process.env.DB_PORT || 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};