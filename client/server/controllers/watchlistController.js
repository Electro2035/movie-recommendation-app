const supabase = require('../config/supabase');

// 1. Menambah Film ke Watchlist (CREATE)
exports.addToWatchlist = async (req, res) => {
    // Tambahkan rating dan year di req.body
    const { movie_id, title, poster_path, rating, year } = req.body; 
    const user_id = req.user.id;

    try {
        const { data, error } = await supabase
            .from('watchlists')
            // Masukkan rating dan year ke dalam baris insert Supabase
            .insert([{ user_id, movie_id, title, poster_path, rating, year }]) 
            .select();

        if (error) throw error;
        res.status(201).json({ success: true, message: 'Berhasil ditambahkan', data });
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
    const tmdb_movie_id = req.params.id; // ID unik dari tabel watchlist (bukan ID TMDB)
    const user_id = req.user.id;

    try {
        // Hapus data, tapi pastikan yang dihapus benar-benar milik user tersebut
        const { error } = await supabase
            .from('watchlists')
            .delete()
            .match({ movie_id: tmdb_movie_id, user_id: user_id });

        if (error) throw error;
        res.status(200).json({ success: true, message: 'Berhasil dihapus dari Watchlist' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateWatchlistStatus = async (req, res) => {
    const tmdb_id = req.params.id;
    const user_id = req.user.id;
    const { status } = req.body; // Menerima status baru ('watched' atau 'to_watch')

    try {
        const { data, error } = await supabase
            .from('watchlists')
            .update({ status: status })
            .match({ movie_id: tmdb_id, user_id: user_id })
            .select();

        if (error) throw error;
        res.status(200).json({ success: true, message: 'Status berhasil diperbarui', data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};