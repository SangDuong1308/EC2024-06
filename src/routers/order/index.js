const express = require('express');
const { authentication, verifyRole } = require('../../utils/auth');
const { asyncHandler } = require('../../utils/errorHandle');
const orderController = require('../../controllers/order.controller');
const { ROLES } = require('../../constants');
const router = express.Router();

router.use(authentication)
router.get('/detail', asyncHandler(orderController.getOrderDetail))

// checkout overview
router.use(verifyRole(ROLES.User))
router.get('/checkout/overview', asyncHandler(orderController.checkoutReview))

router.post('/checkout/cash', orderController.checkoutPreProcess ,asyncHandler(orderController.checkoutCash))

module.exports = router;