const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

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

// --- FUNGSI GOOGLE LOGIN ---
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // 1. Verifikasi token asli dari Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    // 2. Ambil data email dari Google
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // 3. Cek apakah user sudah ada di database Supabase kita
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (fetchError) {
      return res.status(400).json({ success: false, message: fetchError.message });
    }

    let user;

    // 4. Jika belum ada, buat akun baru secara otomatis (Auto-Register)
    if (users.length === 0) {
      // Buat password acak yang di-hash dengan bcrypt agar konsisten dengan fungsi register
      const randomPassword = Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ email: email, password: hashedPassword, name: name, avatar: picture }]) // Simpan juga nama dan avatar dari Google
        .select();

      if (insertError) {
        return res.status(400).json({ success: false, message: insertError.message });
      }
      
      user = newUser[0];
    } else {
      // Jika user sudah ada, gunakan data user tersebut
      user = users[0];
    }

    // 5. Buatkan JWT token versi aplikasi kita sendiri (berlaku 1 hari agar sama dengan fungsi login)
    const appToken = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // 6. Kirim token kembali ke frontend
    res.status(200).json({
      success: true,
      message: 'Google login successful',
      token: appToken,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user.id; // Diambil dari req.user hasil verifyToken

  try {
    const { data, error } = await supabase
      .from('users')
      .update({ name, avatar })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Profil diperbarui',
      user: data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal update profil' });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${req.user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Unggah ke Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) throw error;

    // Ambil Public URL
    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    res.status(200).json({
      success: true,
      avatarUrl: publicUrlData.publicUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

// Pastikan multer di-export juga untuk digunakan di Routes
exports.uploadMiddleware = upload.single('image');