const Post = require('../models/post');
const response = require('../utils/response');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
    try {
        const data = await Post.getAll();
        response.success(res, data.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ message: "ID harus angka" });

    try {
        const data = await Post.getById(id);
        if (!data.rows[0]) return res.status(404).json({ message: "Data tidak ditemukan" });
        response.success(res, data.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Pastikan req.file.minioUrl ada (hasil dari middleware uploadToMinio)
    if (!req.file || !req.file.minioUrl) {
        return res.status(400).json({ message: "Gambar wajib diunggah" });
    }

    const { judul, isi, category_id } = req.body;
    const gambar = req.file.minioUrl; 

    try {
        const data = await Post.create(judul, isi, gambar, category_id);
        // Pesan disesuaikan
        response.success(res, data.rows[0], 'Post berhasil dibuat. Gambar otomatis diubah ke WebP dan disimpan di MinIO');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { judul, isi, category_id } = req.body;

    try {
        const oldPost = await Post.getById(id);
        if (!oldPost.rows[0]) {
            return res.status(404).json({ message: "Post tidak ditemukan" });
        }

        let gambar = oldPost.rows[0].gambar;
        
        // Jika ada upload baru, otomatis akan pakai URL WebP yang baru
        if (req.file && req.file.minioUrl) {
            gambar = req.file.minioUrl;
        }

        await Post.update(id, judul, isi, gambar, category_id);
        response.success(res, null, 'Post berhasil diupdate');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.remove = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.getById(id);
        if (post.rows[0]) {
            await Post.remove(id);
            response.success(res, null, 'Post berhasil dihapus');
        } else {
            res.status(404).json({ message: "Post tidak ditemukan" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};