const express = require('express');
const { authentication, verifyRole } = require('../../utils/auth');
const { asyncHandler } = require('../../utils/errorHandle');
const orderController = require('../../controllers/order.controller');
const { ROLES } = require('../../constants');
const router = express.Router();

// VNPAY payment return
router.get('/vnpay_return', asyncHandler(orderController.handleVnpReturn))

// ZALO PAY callback
router.post('/callback/zalopay', asyncHandler(orderController.handleZalopayCallback))

router.use(authentication)
router.get('/detail', asyncHandler(orderController.getOrderDetail))

// checkout overview
router.use(verifyRole(ROLES.User))
router.get('/checkout/overview', asyncHandler(orderController.checkoutReview))
router.get('/me', asyncHandler(orderController.getOrderByUser));

// checkout by cash
router.post('/checkout/cash', orderController.checkoutPreProcess ,asyncHandler(orderController.checkoutCash))

// checkout with vnpay
router.post('/create_payment_url', asyncHandler(orderController.getVnpUrl))

// checkout with zalopay
router.post('/checkout/zalopay', orderController.checkoutPreProcess, asyncHandler(orderController.checkoutZalo))


module.exports = router;