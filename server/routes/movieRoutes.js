const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/trending', movieController.getTrending);
router.get('/search', movieController.searchMovies);
// Tambahkan ini untuk handle genre atau list movie biasa
router.get('/', movieController.getMovies); 
router.get('/:id', movieController.getMovieDetails);

module.exports = router;