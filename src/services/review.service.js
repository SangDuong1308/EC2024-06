const reviewModel = require("../models/review.model");
const { removeNestedNullUndefined } = require("../utils");

class Review {
    constructor(reviewData) {
        this.review_userId = reviewData.userId;
        this.review_orderId = reviewData.orderId;
        this.review_productId = reviewData.productId;
        this.review_content_text = reviewData.content_text;
        this.review_content_image = reviewData.content_image;
        this.review_star = reviewData.star;
        this.review_title = reviewData.title;
        this.review_date = reviewData.date;
        this.review_type = reviewData.type;
    }
}

module.exports = {
    async getReviewsByProductId({ productId, page = 1, limit = 10 }) {
        const reviews = await reviewModel.find({ review_productId: productId}).skip((page - 1) * limit).populate('review_userId').limit(limit);

        console.log('reviews::',reviews);

        const reviewsReponse = reviews.map(review => {
            return {
                ...review.toObject(),
                userId: review.review_userId._id
            }
        })

        return reviewsReponse;
    },

    async userCreateReview({reviewData}) {
        const review = new Review(reviewData);
        removeNestedNullUndefined(review);
        console.log('Review created::',review);
        return await reviewModel.create(review);
    }
}