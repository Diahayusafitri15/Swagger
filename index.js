require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const userRoutes = require('./routes/user_route');
const swaggerDocument = require('./utils/swagger');
const postRoutes = require('./routes/post_route');

const app = express();
// PERBAIKAN: Gunakan variabel dari .env agar lebih dinamis
const PORT = process.env.PORT || 3000; 

app.use(express.json());

// PERBAIKAN: Pastikan folder 'public/images' tersedia otomatis
const uploadPath = path.join(__dirname, 'public/images');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Konfigurasi Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/'); // Sudah sesuai permintaan pembimbing
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
});

// Akses statis folder gambar
app.use('/images', express.static('public/images'));

// Routes
app.use('/', userRoutes);
app.use('/', postRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📘 Swagger: http://localhost:${PORT}/api-docs`);
});