const express = require('express');
const { authentication } = require('../../utils/auth');
const { asyncHandler } = require('../../utils/errorHandle');
const cartController = require('../../controllers/cart.controller');
const router = express.Router();

router.use(authentication)
router.get('/', asyncHandler(cartController.getCart))
router.post('/', asyncHandler(cartController.addProductToCart))

router.delete('/', asyncHandler(cartController.deleteCart))
router.post('/note', asyncHandler(cartController.createNote))

router.patch('/remove/product/:productId', asyncHandler(cartController.removeProductFromCart))
router.patch('/dec/product/:productId', asyncHandler(cartController.decProductQuantity))
router.patch('/inc/product/:productId', asyncHandler(cartController.incProductQuantity))

module.exports = router;