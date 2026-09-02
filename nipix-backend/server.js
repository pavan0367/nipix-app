const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const pool = require('./database');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

pool.getConnection()
    .then(connection => {
        console.log('✅ Nipix MySQL Connected Successfully');
        connection.release();
    })
    .catch(err => console.error('❌ MySQL Connection Error:', err.message));

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/posts', require('./src/routes/posts'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/stories', require('./src/routes/stories'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Nipix Backend running on http://localhost:${PORT}`));