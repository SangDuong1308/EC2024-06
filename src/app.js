require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const swaggerDocs = require('./utils/swagger');
const { Api404Error } = require('./constants/error.reponse');
const cookieParser = require("cookie-parser");
const santize = require('express-mongo-sanitize');
const app = express();

const corsOptions = {
    origin: 'https://ec-2024-06-frontend.vercel.app/',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

// init middleware
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(helmet());
app.use(
    compression({
        level: 5,
        threshold: 100 * 1000, // 100kB
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
require('./dbs/init.mongodb');

// init routes

swaggerDocs(app, process.env.PORT);
app.use(santize())
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
