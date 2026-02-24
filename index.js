require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./utils/swagger');

// Import Routes
const userRoutes = require('./routes/user_route');
const postRoutes = require('./routes/post_route');
const categoryRoutes = require('./routes/category_route');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk membaca JSON dan URL-encoded (untuk upload)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyediakan akses folder publik untuk gambar
app.use('/public', express.static('public'));

// --- KONFIGURASI ROUTE DENGAN PREFIX ---
// Ini harus sama dengan yang tertulis di file swagger.js kamu!
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/categories', categoryRoutes);

// --- DOKUMENTASI SWAGGER ---
// Akses di http://localhost:3000/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Route dasar untuk mengecek server
app.get('/', (req, res) => {
    res.send('🚀 Server API PKL siap digunakan!');
});

// Middleware penanganan Error 404 (Halaman tidak ditemukan)
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Endpoint tidak ditemukan. Cek kembali URL atau Prefix-nya."
    });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📖 Swagger UI: http://localhost:${PORT}/api-docs\n`);
});