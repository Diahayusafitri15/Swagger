const Post = require('../models/post');
const response = require('../utils/response');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
    const data = await Post.getAll();
    response.success(res, data.rows);
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ message: "ID harus angka" });

    const data = await Post.getById(id);
    if (!data.rows[0]) return res.status(404).json({ message: "Data tidak ditemukan" });
    response.success(res, data.rows[0]);
};

exports.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) return res.status(400).json({ message: "Gambar wajib diunggah" });

    const { judul, isi, category_id } = req.body;
    const gambar = req.file.filename;

    try {
        const data = await Post.create(judul, isi, gambar, category_id);
        response.success(res, data.rows[0], 'Post berhasil dibuat');
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ errors: errors.array() });
    }

    const { judul, isi, category_id } = req.body;

    try {
        const oldPost = await Post.getById(id);
        if (!oldPost.rows[0]) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: "Post tidak ditemukan" });
        }

        let gambar = oldPost.rows[0].gambar;
        if (req.file) {
            const oldPath = path.join(__dirname, '../public/images', oldPost.rows[0].gambar);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            gambar = req.file.filename;
        }

        await Post.update(id, judul, isi, gambar, category_id);
        response.success(res, null, 'Post berhasil diupdate');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.remove = async (req, res) => {
    const { id } = req.params;
    const post = await Post.getById(id);
    if (post.rows[0]) {
        const filePath = path.join(__dirname, '../public/images', post.rows[0].gambar);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        await Post.remove(id);
        response.success(res, null, 'Post dihapus');
    } else {
        res.status(404).json({ message: "Post tidak ditemukan" });
    }
};