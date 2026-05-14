const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const verifyToken = require('../middlewares/authMiddleware'); // Satpam JWT

// Kita pasang "verifyToken" di tengah sebagai penjaga. 
// Kalau token tidak valid, proses tidak akan masuk ke Controller.
router.post('/', verifyToken, watchlistController.addToWatchlist);
router.get('/', verifyToken, watchlistController.getWatchlist);
router.delete('/:id', verifyToken, watchlistController.removeFromWatchlist);

module.exports = router;