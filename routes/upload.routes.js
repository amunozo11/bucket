const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const upload = require('../config/storage');
const authUpload = require('../middlewares/authUpload');
require('dotenv').config();

/**
 * POST /api/upload
 * Sube un archivo al bucket.
 */
router.post('/upload', authUpload, (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                ok: false,
                message: 'No se envió ningún archivo.'
            });
        }

        const baseUrl = process.env.PUBLIC_BASE_URL.endsWith('/')
            ? process.env.PUBLIC_BASE_URL
            : `${process.env.PUBLIC_BASE_URL}/`;

        res.json({
            ok: true,
            filename: req.file.filename,
            url: `${baseUrl}${req.file.filename}`,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
    });
});

/**
 * GET /api/files
 * Lista todos los archivos en el bucket (opcional/adicional según solicitud).
 */
router.get('/files', (req, res) => {
    const bucketPath = process.env.BUCKET_PATH || './uploads/';

    fs.readdir(bucketPath, (err, files) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al leer el directorio de archivos.'
            });
        }

        const fileList = files.map(file => {
            const stats = fs.statSync(path.join(bucketPath, file));
            const baseUrl = process.env.PUBLIC_BASE_URL.endsWith('/')
                ? process.env.PUBLIC_BASE_URL
                : `${process.env.PUBLIC_BASE_URL}/`;

            return {
                filename: file,
                url: `${baseUrl}${file}`,
                size: stats.size,
                createdAt: stats.birthtime
            };
        });

        res.json({
            ok: true,
            count: fileList.length,
            files: fileList
        });
    });
});

/**
 * GET /api/files/:filename
 * Obtiene metadatos de un archivo específico.
 */
router.get('/files/:filename', (req, res) => {
    const { filename } = req.params;
    const bucketPath = process.env.BUCKET_PATH || './uploads/';
    const filePath = path.join(bucketPath, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            ok: false,
            message: 'Archivo no encontrado.'
        });
    }

    const stats = fs.statSync(filePath);
    const baseUrl = process.env.PUBLIC_BASE_URL.endsWith('/')
        ? process.env.PUBLIC_BASE_URL
        : `${process.env.PUBLIC_BASE_URL}/`;

    res.json({
        ok: true,
        data: {
            filename: filename,
            url: `${baseUrl}${filename}`,
            size: stats.size,
            createdAt: stats.birthtime,
            mimetype: path.extname(filename) // Aproximación
        }
    });
});

module.exports = router;
