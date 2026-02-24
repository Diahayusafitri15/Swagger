const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller');
const upload = require('../middlewares/upload'); // Sesuai folder 'middlewares'
const auth = require('../middlewares/auth');
const { body } = require('express-validator');

const postValidation = [
    body('judul').notEmpty().withMessage('Judul wajib diisi').trim(),
    body('isi').notEmpty().withMessage('Isi wajib diisi').trim(),
    body('category_id').isNumeric().withMessage('Kategori harus berupa angka ID')
];

router.get('/', postController.getAll);
router.get('/:id', postController.getById); // Tanpa regex agar tidak PathError

// Struktur yang BENAR:
router.post('/', 
  auth, // <--- Harus di urutan pertama setelah path
  upload.single('gambar'), 
  postValidation, 
  postController.create
);

router.put('/:id', 
    auth, 
    upload.single('gambar'), 
    postValidation, 
    postController.update
);

router.delete('/:id', auth, postController.remove);

module.exports = router;