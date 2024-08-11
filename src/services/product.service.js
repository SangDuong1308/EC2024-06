const productModel = require("../models/product.model");
const { getSelectData, unSelectData } = require("../utils");

module.exports = {
    async getAllProducts({
        limit = 50,
        sort,
        page = 1,
        filter = {},
        select = {},
    }) {
        const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
        return await productModel
            .find(filter)
            .sort(sortBy)
            .skip((page - 1) * limit)
            .limit(limit)
            .select(getSelectData(select))
            .lean();
    },
    async getProductById({ productId, unSelect = [], select = [] }) {
        let unSelectFields = {};
        let selectedFields = {};
        if (unSelect) unSelectFields = unSelectData(unSelect);
        if (select) selectedFields = getSelectData(select);
        console.log({
            ...unSelectFields,
            ...selectedFields,
        });
        return await productModel
            .findById(productId)
            .select({ ...unSelectFields, ...selectedFields })
            .lean()
            .exec();
    }
}