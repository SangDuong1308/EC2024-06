'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const router = express.Router();

router.post('/signup', asyncHandler(accessController.signUp));
router.post('/login', asyncHandler(accessController.login))

module.exports = router;
