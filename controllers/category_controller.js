const pool = require('../config/db');
const { validationResult } = require('express-validator');
const response = require('../utils/response');

// 1. Ambil semua kategori
const getAll = async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM categories ORDER BY id DESC');
        response.success(res, data.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Ambil satu kategori berdasarkan ID (Baru - Agar sama dengan Posts)
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
        
        if (data.rows.length === 0) {
            return res.status(404).json({ message: "Kategori tidak ditemukan" });
        }
        
        response.success(res, data.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Buat kategori baru
const create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nama_kategori } = req.body;
    try {
        const data = await pool.query(
            'INSERT INTO categories (nama_kategori) VALUES ($1) RETURNING *',
            [nama_kategori]
        );
        response.success(res, data.rows[0], 'Kategori berhasil dibuat');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Update kategori (Baru - Agar sama dengan Posts)
const update = async (req, res) => {
    const { id } = req.params;
    const { nama_kategori } = req.body;
    try {
        const data = await pool.query(
            'UPDATE categories SET nama_kategori = $1 WHERE id = $2 RETURNING *',
            [nama_kategori, id]
        );

        if (data.rows.length === 0) {
            return res.status(404).json({ message: "Kategori tidak ditemukan" });
        }

        response.success(res, data.rows[0], 'Kategori berhasil diperbarui');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Hapus kategori
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const check = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
        
        if (check.rowCount === 0) {
            return res.status(404).json({ message: "Kategori tidak ditemukan" });
        }

        response.success(res, null, 'Kategori berhasil dihapus');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// EKSPOR SEMUA FUNGSI (PENTING!) agar tidak TypeError
module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};