const { InternalServerError } = require('../constants/error.reponse');
const categoryModel = require('../models/category.model');

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
    addCategory = async (req, res, next) => {
        
    }
}

module.exports = new CategoryController();