const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../utils/errorHandle');
const reviewController = require('../../controllers/review.controller');
const { authentication } = require('../../utils/auth');
const { ValidateUserReviewProduct } = require('../../validation/review.validation');
const { uploadReview } = require('../../configs/config.multer');

router.get('/all', asyncHandler(reviewController.getAllReviewsOfProduct))
router.use(authentication)

// Trying to fix
router.post('/user/create', uploadReview.single('review_content_image'), ValidateUserReviewProduct, asyncHandler(reviewController.userCreateReview))

module.exports = router;