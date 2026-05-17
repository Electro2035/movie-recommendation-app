const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

// 1. Mengambil Film yang Sedang Tren
exports.getTrending = async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
        res.status(200).json({ success: true, data: response.data.results });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data dari TMDB' });
    }
};

// 2. Mencari Film berdasarkan Judul
exports.searchMovies = async (req, res) => {
    const query = req.query.q; // Mengambil kata kunci dari URL (?q=batman)
    
    if (!query) return res.status(400).json({ success: false, message: 'Kata kunci pencarian kosong' });

    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        res.status(200).json({ success: true, data: response.data.results });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mencari film' });
    }
};

// 3. Mengambil Detail Satu Film Spesifik
exports.getMovieDetails = async (req, res) => {
    const movieId = req.params.id; // Mengambil ID dari URL (/api/movies/123)

    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil detail film' });
    }
};

// Ambil film trending minggu ini
exports.getTrending = async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`);
        res.json({ success: true, data: response.data.results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Ambil film berdasarkan genre atau discover
exports.getMovies = async (req, res) => {
    const { genre } = req.query;
    try {
        // Jika ada genre, gunakan discover endpoint. Jika tidak, ambil populer.
        const url = genre 
            ? `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genre}`
            : `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`;
            
        const response = await axios.get(url);
        res.json({ success: true, data: response.data.results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};