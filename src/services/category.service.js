const { ForbiddenRequest } = require("../constants/error.reponse");
const categoryModel = require("../models/category.model");
const { unSelectData, getSelectData } = require("../utils");

module.exports = {
    async getCategoryById({ categoryId, unSelect=[], select = [] }) {
        let unSelectFields = {};
        let selectedFields = {};
        if (unSelect) unSelectFields = unSelectData(unSelect);
        if (select) selectedFields = getSelectData(select);
        console.log({
            ...unSelectFields,
            ...selectedFields,
        });
        return await categoryModel
            .findById(categoryId)
            .select({ ...unSelectFields, ...selectedFields })
            .lean()
            .exec();
    },
    async createCategory({ category_name, isActive }) {
        const holderCategory = await categoryModel.findOne({category_name}).lean();

        if (holderCategory) {
            throw new ForbiddenRequest('Error: Category already exists!');
        }
        return await categoryModel.create({ 
            category_name, 
            isActive
        });
    },
    async deleteCategory({ categoryId }) {
        return await categoryModel.findByIdAndDelete(categoryId).lean().exec();
    }
}