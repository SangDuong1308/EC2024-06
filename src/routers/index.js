'use strict';

const express = require('express');
const router = express.Router();

router.use('/', require('./access'));


module.exports = router;
