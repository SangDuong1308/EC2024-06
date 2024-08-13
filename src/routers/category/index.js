const express = require('express');
const { asyncHandler } = require('../../utils/errorHandle');
const { getAllCategories, getCategoryById } = require('../../controllers/category.controller');

const router = express.Router();

router.get('/', asyncHandler(getAllCategories));
router.get('/:categoryId', asyncHandler(getCategoryById));

module.exports = router;
