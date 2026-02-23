const Post = require('../models/post');
const response = require('../utils/response');
const fs = require('fs');
const path = require('path');

exports.getAll = async (req, res) => {
    const data = await Post.getAll();
    response.success(res, data.rows);
};

exports.getById = async (req, res) => {
    const data = await Post.getById(req.params.id);
    if (!data.rows[0]) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    response.success(res, data.rows[0]);
};

// --- TAMBAH POST (POST) ---
exports.create = async (req, res) => {
    // 1. Validasi teks (judul & isi)
    if (!req.body || !req.body.judul || !req.body.isi) {
        return res.status(400).json({ message: "Judul dan isi harus diisi" });
    }

    // 2. VALIDASI GAMBAR: Harus ada file yang diupload
    if (!req.file) {
        return res.status(400).json({ message: "Gambar wajib diunggah" });
    }

    const { judul, isi } = req.body;
    const gambar = req.file.filename; // Nama file dari Multer

    const data = await Post.create(judul, isi, gambar);
    response.success(res, data.rows[0], 'Post berhasil dibuat');
};

// --- UPDATE POST (PUT) ---
exports.update = async (req, res) => {
    const { id } = req.params;

    // 1. Validasi teks
    if (!req.body || !req.body.judul || !req.body.isi) {
        return res.status(400).json({ 
            message: "Judul dan isi wajib diisi di Swagger (Form-Data)" 
        });
    }

    // 2. VALIDASI GAMBAR: Pada update pun gambar sekarang wajib diisi
    if (!req.file) {
        return res.status(400).json({ message: "Silakan pilih gambar baru untuk update" });
    }

    const { judul, isi } = req.body;

    const oldPost = await Post.getById(id);
    if (!oldPost.rows[0]) {
        return res.status(404).json({ message: "Post tidak ditemukan" });
    }

    // Hapus gambar lama dari folder public/images agar tidak penuh
    if (oldPost.rows[0].gambar) {
        const oldFilePath = path.join(__dirname, '../public/images', oldPost.rows[0].gambar);
        if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
        }
    }

    const gambar = req.file.filename; // Nama file baru
    await Post.update(id, judul, isi, gambar);
    response.success(res, null, 'Post berhasil diupdate');
};

exports.remove = async (req, res) => {
    const { id } = req.params;
    const post = await Post.getById(id);
    if (post.rows[0]?.gambar) {
        const filePath = path.join(__dirname, '../public/images', post.rows[0].gambar);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    await Post.remove(id);
    response.success(res, null, 'Post berhasil dihapus');
};