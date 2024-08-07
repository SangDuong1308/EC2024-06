const express = require('express');
const { asyncHandler } = require('../../utils/checkAuth');

const router = express.Router();

router.use('/category', asyncHandler());

module.exports = router;
