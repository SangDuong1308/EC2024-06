const { Types } = require("mongoose");
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
    },
    async getProductByIdAndUpdate(productId, update) {
        return await productModel.findByIdAndUpdate(productId, update)
    },
    async checkExistProduct(productId, select = []) {
        return await productModel.findById(productId).select(select).lean();
    },
    async searchProduct(name) {
        const regexSearch = new RegExp(name);
        return await productModel
            .find(
                {
                    isActive: true,
                    $text: { $search: regexSearch, $caseSensitive: false },
                },
                { score: { $meta: "textScore" } }
            )
            .sort({ score: { $meta: "textScore" } })
            .lean();
    },
    async createProduct(product) {
        return await productModel.create({
            ...product
        })
    },
    async updateProduct({ productId, bodyUpdate, product_thumb }) {
        const filter = {
            _id: new Types.ObjectId(productId),
        };
        if (product_thumb) {
            bodyUpdate = {
                ...bodyUpdate,
                product_thumb,
            };
        }
        return await productModel.findOneAndUpdate(
            filter,
            { $set: { ...bodyUpdate } },
            {
                new: true,
            }
        );
    },
    async deleteProductById(filter) {
        return await productModel.deleteOne(filter);
    },
}