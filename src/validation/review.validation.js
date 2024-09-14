const joi = require('joi');
const { BadRequest } = require('../constants/error.reponse');
const { deleteFileByRelativePath } = require('../utils');
const moment = require('moment-timezone');

const userReview = joi.object({
    productId: joi.string().required(),
    review_content_text: joi.string().required(),
    review_star: joi.number().required(),
    review_title: joi.string().required(),
    review_date: joi.date().required(),
})

module.exports = {
    async ValidateUserReviewProduct(req, res, next) {
        const data = req.body;
        Object.keys(data).forEach((key) => {
            if (!Object.keys(userReview.describe().keys).includes(key))
                delete data[key];
        });
        console.log("data", data);
        try {
            if (data.date)
                data.date = moment
                    .tz(data.date, "DD/MM/YYYY", "Asia/Ho_Chi_Minh")
                    .toDate();
            await userReview.validateAsync(data);
            next();
        } catch (error) {
            if (req.file) deleteFileByRelativePath(req.file.path);
            return next(
                new BadRequest(error?.details?.at(0)?.message || error.message)
            );
        }
    }
}