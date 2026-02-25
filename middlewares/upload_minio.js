const multer = require('multer');
const sharp = require('sharp');
const Minio = require('minio');

// Konfigurasi MinIO Client kamu
const minioClient = new Minio.Client({
    endPoint: '127.0.0.1', // sesuaikan dengan host MinIO kamu
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin', // Ganti
    secretKey: 'minioadmin'  // Ganti
});

const bucketName = 'my-bucket'; // Ganti

// Gunakan memoryStorage agar file tidak disimpan di hardisk lokal dulu, melainkan di RAM
const upload = multer({ storage: multer.memoryStorage() });

const uploadToMinio = async (req, res, next) => {
    // Jika tidak ada file yang diupload, lanjut ke controller
    if (!req.file) {
        return next();
    }

    try {
        // 1. Konversi gambar yang ada di memori (buffer) menjadi WebP
        const webpBuffer = await sharp(req.file.buffer)
            .webp({ quality: 80 }) // Kualitas WebP (0-100)
            .toBuffer();

        // 2. Buat nama file baru dengan ekstensi .webp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = `post-${uniqueSuffix}.webp`;

        // 3. Upload file hasil konversi ke MinIO
        await minioClient.putObject(bucketName, fileName, webpBuffer, webpBuffer.length, {
            'Content-Type': 'image/webp'
        });

        // 4. Simpan URL-nya di req.file agar bisa ditangkap oleh controller
        req.file.minioUrl = `http://127.0.0.1:9000/${bucketName}/${fileName}`;
        
        next();
    } catch (error) {
        return res.status(500).json({ message: "Gagal memproses dan upload gambar", error: error.message });
    }
};

module.exports = {
    upload,
    uploadToMinio
};