const configReview = require("../configs/config,review");
const { BadRequest, InternalServerError } = require("../constants/error.reponse");
const productService = require("../services/product.service");
const reviewService = require("../services/review.service");
const { uploadFileFromLocalWithMulter } = require("../services/upload.service");
const { deleteFileByRelativePath } = require("../utils");

module.exports = {
    async getAllReviewsOfProduct(req, res) {
        const { productId, page = 1, limit = 10 } = req.query;
        if (!productId) {
            throw new BadRequest("Missing productId in query");
        }
        const reviews = await reviewService.getReviewsByProductId({productId, page, limit})

        res.status(200).json({
            message: "Get all comments of product successfully",
            metadata: reviews
        })
    },
    async userCreateReview(req, res) {
        const { userId } = req.user;

        let reviewData = { ...req.body };
        console.log("ReviewData:" ,reviewData);

        const foundProduct = await productService.getProductById({productId: reviewData.productId});

        if (!foundProduct) {
            throw new BadRequest("Product not found");
        }

        if (req.file) {
            let image_upload_url = await uploadFileFromLocalWithMulter(req.file, process.env.CLOUDINARY_USER_COMMENT_PATH);

            if (!image_upload_url) deleteFileByRelativePath(req.file.path);

            let reviewData = {
                ...reviewData,
                content_text: reviewData.content_text,
                content_image: image_upload_url || "",
            };
        }; 
        
        reviewData = {
            ...reviewData,
            type: configReview.USER_REVIEW,
            userId,
        } 

        const createdReview = await reviewService.userCreateReview({reviewData});

        if (!createdReview) {
            throw new InternalServerError("Create review failed");
        }

        res.status(200).json({
            message: "Create review successfully",
            metadata: createdReview
        })
    }
}