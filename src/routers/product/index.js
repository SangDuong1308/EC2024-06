const express = require('express');
const { asyncHandler } = require('../../utils/errorHandle');
const { getAllProducts, getProductById } = require('../../controllers/product.controller');

const router = express.Router();
router.get('/', asyncHandler(getAllProducts));
router.get('/:productId', asyncHandler(getProductById));
module.exports = router;
