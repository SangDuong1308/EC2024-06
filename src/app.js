require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const swaggerDocs = require('./utils/swagger');
const { Api404Error } = require('./constants/error.reponse');
const app = express();

// init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
require('./dbs/init.mongodb');

// init routes

swaggerDocs(app, process.env.PORT);

app.use('/', require('./routers'));

app.use((req, res, next) => {
    next(new Api404Error('Not found'));
})

app.use((err, req, res, next) => {
    console.error(err);
    next(err);
})

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
})

module.exports = app;
