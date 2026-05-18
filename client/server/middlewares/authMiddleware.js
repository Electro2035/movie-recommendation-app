const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Mengambil token dari header request
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ada.' });
    }

    // Format token biasanya "Bearer [token_string]", kita pisahkan untuk ambil tokennya saja
    const token = authHeader.split(' ')[1];
    
//debugging: pastikan token dan rahasia JWT benar-benar ada
    //console.log("Token yang ditangkap:", token);
    //console.log("Rahasia JWT:", process.env.JWT_SECRET);

    try {
        // Verifikasi token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Simpan data user ke request untuk dipakai di fungsi selanjutnya
        next(); // Lanjut ke proses berikutnya
    } catch (err) {
        res.status(400).json({ success: false, message: 'Token tidak valid atau sudah kedaluwarsa' });
    }
};

module.exports = verifyToken;