require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const swaggerDocs = require('./utils/swagger');
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

// init middleware
app.use(cors(corsOptions));
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
    const error = new Error('Not found');
    error.status = 404;
    next(error);
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
