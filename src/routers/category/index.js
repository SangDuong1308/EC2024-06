const express = require('express');
const { asyncHandler } = require('../../utils/errorHandle');
const { getAllCategories } = require('../../controllers/category.controller');

const router = express.Router();

router.get('/', asyncHandler(getAllCategories));

module.exports = router;
