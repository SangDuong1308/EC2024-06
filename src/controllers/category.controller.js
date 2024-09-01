const { InternalServerError, BadRequest, Api404Error } = require('../constants/error.reponse');
const { CREATED } = require('../constants/success.response');
const categoryModel = require('../models/category.model');
const categoryService = require('../services/category.service');

class CategoryController {
    getAllCategories = async (req, res, next) => {
        let categories = await categoryModel.find({});

        console.log(categories)

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
        res.status(200).json({
            message: 'Get all categories successfully!',
            metadata: categories
        });
    }
    getCategoryById = async (req, res, next) => {
        try {
            const {categoryId} = req.params;

            if (!categoryId) throw new BadRequest('Missing required arguments');

            const found_category = await categoryService.getCategoryById({
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
    addCategory = async (req, res, next) => {
        new CREATED({
            message: 'Create category successfully!',
            metadata: await categoryService.createCategory(req.body),
        }).send(res)
    }
    deleteCategory = async (req, res, next) => {
        try {
            const { categoryId } = req.params;

            if (!categoryId) throw new BadRequest('Category ID is required');

            const deletedCategory = await categoryService.deleteCategory({ categoryId });

            if (!deletedCategory) throw new Api404Error('Category Not Found');

            res.status(200).json({
                message: 'Category deleted successfully!'
            });
        } catch (err) {
            next(new InternalServerError(err.message));
        }
    }
    updateCategory = async (req, res, next) => {
        try {
            const { categoryId } = req.params;
            let updatedCategory = req.body;

            if (!categoryId || !updatedCategory)
                throw new BadRequest("Missing some information in body");

            const result = await categoryModel.updateOne(
                { _id: categoryId },
                { $set: { ...updatedCategory } }
            );
            
            res.status(200).json({
                message: "Category successfully updated",
            });
        } catch(error) {
            next(new InternalServerError(error.message));
        }
    }
}
module.exports = new CategoryController();