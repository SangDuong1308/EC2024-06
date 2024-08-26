const express = require('express');
const { asyncHandler } = require('../../utils/errorHandle');
const productController = require('../../controllers/product.controller');

const router = express.Router();
router.get('/search', asyncHandler(productController.searchProduct))
router.get('/', asyncHandler(productController.getAllProducts));
router.get('/:productId', asyncHandler(productController.getProductById));
module.exports = router;
