const supabase = require('../config/supabase');

// 1. Menambah Film ke Watchlist (CREATE)
exports.addToWatchlist = async (req, res) => {
    const { movie_id, title, poster_path } = req.body;
    const user_id = req.user.id; // Didapatkan dari JWT Middleware

    try {
        const { data, error } = await supabase
            .from('watchlists')
            .insert([{ user_id, movie_id, title, poster_path }])
            .select();

        if (error) throw error;
        res.status(201).json({ success: true, message: 'Berhasil ditambahkan ke Watchlist', data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Melihat Daftar Watchlist User (READ)
exports.getWatchlist = async (req, res) => {
    const user_id = req.user.id;

    try {
        const { data, error } = await supabase
            .from('watchlists')
            .select('*')
            .eq('user_id', user_id); // Hanya ambil data milik user ini

        if (error) throw error;
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Menghapus Film dari Watchlist (DELETE)
exports.removeFromWatchlist = async (req, res) => {
    const watchlist_id = req.params.id; // ID unik dari tabel watchlist (bukan ID TMDB)
    const user_id = req.user.id;

    try {
        // Hapus data, tapi pastikan yang dihapus benar-benar milik user tersebut
        const { error } = await supabase
            .from('watchlists')
            .delete()
            .match({ id: watchlist_id, user_id: user_id });

        if (error) throw error;
        res.status(200).json({ success: true, message: 'Berhasil dihapus dari Watchlist' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};