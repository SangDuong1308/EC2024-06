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
    }
}