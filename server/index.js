const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware dasar
app.use(cors());
app.use(express.json()); // Wajib agar server bisa membaca input JSON

// Import rute
const authRoutes = require('./routes/authRoutes');

// Daftarkan rute
app.use('/api/auth', authRoutes);

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server backend berjalan di http://localhost:${PORT}`);
});