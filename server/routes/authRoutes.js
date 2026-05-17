const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authController = require('../controllers/authController');
const { googleLogin } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

// URL akan menjadi: /api/auth/register dan /api/auth/login
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google-login', googleLogin);
router.get('/me', verifyToken, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, avatar')
    .eq('id', req.user.id)
    .single();
    
  if (error) return res.status(400).json({ success: false });
  res.json({ success: true, user: data });
});
router.put('/:id', verifyToken, authController.updateProfile);
router.post('/upload-avatar', verifyToken, authController.uploadMiddleware, authController.uploadAvatar);

module.exports = router;