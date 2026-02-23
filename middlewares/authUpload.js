require('dotenv').config();

/**
 * Middleware para validar la clave de seguridad en las peticiones de subida.
 */
const authUpload = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validKey = process.env.UPLOAD_KEY;

    if (!apiKey || apiKey !== validKey) {
        return res.status(401).json({
            ok: false,
            message: 'No autorizado. x-api-key inválida o ausente.'
        });
    }

    next();
};

module.exports = authUpload;
