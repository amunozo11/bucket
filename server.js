const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`-----------------------------------------`);
    console.log(`🚀 SISPEGIB Bucket API ejecutándose en port ${PORT}`);
    console.log(`📁 Bucket Path: ${process.env.BUCKET_PATH}`);
    console.log(`🌍 Public URL: ${process.env.PUBLIC_BASE_URL}`);
    console.log(`-----------------------------------------`);
});
