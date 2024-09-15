const { Schema, model, Types } = require('mongoose');
const { required } = require('joi');
const config = require('../configs/config,review')

const DOCUMENT_NAME = 'Review';
const COLLECTION_NAME = 'Reviews';

const reviewSchema = new Schema(
    {
        review_userId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        },
        review_productId: {
            type: Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        review_childId: { 
            type: Types.ObjectId, 
            ref: "Review" 
        },
        review_orderId: {
            type: Types.ObjectId,
            ref: 'Order',
        },
        review_type: {
            type: Number,
            required: true,
            enum: [
                config.USER_REVIEW,
                config.SHOP_REPLY
            ]
        },
        review_content_text: {
            type: String,
            required: true,
        },
        review_content_image: String,
        review_star: {
            type: Number,
            required: true,
        },
        review_title: {
            type: String,
        },
        review_date: {
            type: Date,
            default: Date.now()
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

//Export the model
module.exports = model(DOCUMENT_NAME, reviewSchema);