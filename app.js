const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const uploadRoutes = require('./routes/upload.routes');

const app = express();

// Configuración de CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS === '*'
    ? '*'
    : (process.env.ALLOWED_ORIGINS || '').split(',');

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-api-key']
}));

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del bucket (Directorio público)
// Importante: En Hostinger, BUCKET_PATH debe ser accesible vía URL
const bucketPath = process.env.BUCKET_PATH || './uploads/';
app.use('/files', express.static(bucketPath));

// Rutas de la API
app.use('/api', uploadRoutes);

// Ruta de bienvenida / Salud
app.get('/', (req, res) => {
    res.json({
        name: 'SISPEGIB Bucket API',
        version: '1.0.0',
        status: 'Online'
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        ok: false,
        message: 'Ocurrió un error interno en el servidor.'
    });
});

module.exports = app;
