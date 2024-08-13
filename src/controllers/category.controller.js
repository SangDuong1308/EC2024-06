const { InternalServerError, BadRequest, Api404Error } = require('../constants/error.reponse');
const categoryModel = require('../models/category.model');
const { getCategoryById } = require('../services/category.service');

class CategoryController {
    getAllCategories = async (req, res, next) => {
        let categories = await categoryModel.find({});

        if (!categories) {
            throw new InternalServerError('Error: Can not get categories!');
        }
        categories = categories.map((category) => {
            return {
                _id: category._id,
                name: category.category_name,
                isActive: category.isActive
            }
        })
        console.log(categories);
        res.status(200).json({
            message: 'Get all categories successfully!',
            metadata: categories
        });
    }
    getCategoryById = async (req, res, next) => {
        try {
            const {categoryId} = req.params;

            if (!categoryId) throw new BadRequest('Missing required arguments');

            const found_category = await getCategoryById({
                categoryId,
                unSelect: ['__v']
            });
            
            if (!found_category) throw new Api404Error('Category Not Found');

            return res.status(200).json({
                message: "Success",
                metadata: {
                    ...found_category,
                },
            });
        }  catch (err) {
            next(new InternalServerError(err.message));
        }
    }
}
module.exports = new CategoryController();