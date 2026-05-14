const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- FUNGSI REGISTER ---
exports.register = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Enkripsi password (10 adalah tingkat kerumitan acak)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Simpan email dan password yang sudah dienkripsi ke tabel 'users'
        const { data, error } = await supabase
            .from('users')
            .insert([{ email: email, password: hashedPassword }])
            .select();

        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        res.status(201).json({ success: true, message: 'Register berhasil! Silakan login.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
};

// --- FUNGSI LOGIN ---
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Cari user berdasarkan email
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email);

        if (error || users.length === 0) {
            return res.status(400).json({ success: false, message: 'Email tidak terdaftar' });
        }

        const user = users[0];

        // 2. Cocokkan password dari input dengan password acak di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Password salah' });
        }

        // 3. Jika benar, buat Token JWT (Berlaku 1 hari)
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({ 
            success: true, 
            message: 'Login berhasil',
            token: token,
            user: { id: user.id, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
};