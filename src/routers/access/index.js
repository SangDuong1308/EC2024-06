'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../utils/errorHandle');
const { authentication, handleRefreshToken } = require('../../utils/auth');
const router = express.Router();

router.post('/signup', asyncHandler(accessController.signUp));
router.post('/login', asyncHandler(accessController.login));
router.post('/refresh-token', asyncHandler(handleRefreshToken));
router.post('/logout', authentication, asyncHandler(accessController.logout));

module.exports = router;
