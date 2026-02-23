const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller');
const authenticateToken = require('../middlewares/auth');
const multer = require('multer');

// PERBAIKAN: Konfigurasi Multer agar menyimpan ke public/images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/'); // Jangan pakai 'uploads/' lagi
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Routes dengan Middleware Auth
router.get('/posts', postController.getAll);
router.get('/posts/:id', postController.getById);
router.post('/posts', authenticateToken, upload.single('gambar'), postController.create);
router.put('/posts/:id', authenticateToken, upload.single('gambar'), postController.update);
router.delete('/posts/:id', authenticateToken, postController.remove);

module.exports = router;