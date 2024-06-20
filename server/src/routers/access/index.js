'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router();

router.post('/user/signup', accessController.signUp);

module.exports = router;
