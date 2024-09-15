'use strict';

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3052,
    },
    db: {
        host: process.env.DEV_DB_HOST || 'mongodb+srv://localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'ecomDEV',
    },
};

const config = { dev };
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];
