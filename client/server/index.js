const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware dasar
app.use(cors(
    {
        origin: true, // Mengizinkan semua origin selama tahap testing deployment
        credentials: true
    }

));
app.use(express.json()); // Wajib agar server bisa membaca input JSON

// Import rute
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');         
const watchlistRoutes = require('./routes/watchlistRoutes'); 

// Daftarkan rute
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/watchlist', watchlistRoutes);

// const PORT = process.env.PORT || 5000;
/*app.listen(PORT, () => {
    console.log(`✅ Server backend berjalan di http://localhost:${PORT}`);
});*/

module.exports = app; // Ekspor app untuk testing dengan supertest