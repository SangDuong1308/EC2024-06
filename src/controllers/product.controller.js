const { InternalServerError, Api404Error, BadRequest } = require("../constants/error.reponse");
const { getProductById, getAllProducts } = require("../services/product.service");

module.exports = {
    async getAllProducts(req, res, next) {
        const { limit = 50, sort = "ctime", page = 1 } = req.params;
        try {
            const filter = { isActive: true };
            const select = [
                "_id",
                "product_name",
                "product_category",
                "product_description",
                "product_sell_price",
                "product_thumb",
                "image_sources",
                "product_quantity",
                "preparation_time",
                "isActive"
            ];
            const products = await getAllProducts({
                limit,
                sort,
                page,
                filter,
                select,
            });
            if (!products.length) throw new Api404Error("Not Found Products");
            return res
                .status(200)
                .json({ message: "Success", metadata: products });
        } catch (err) {
            next(new InternalServerError(err.message));
        }
    },
    async getProductById(req, res, next) {
        try {
            const { productId } = req.params;
            if (!productId) throw new BadRequest("Missing required arguments");

            const found_products = await getProductById({
                productId,
                unSelect: ["__v"],
            });

            if (!found_products) throw new Api404Error("Product Not Found");
            return res.status(200).json({
                message: "Success",
                metadata: {
                    ...found_products,
                },
            });
        } catch (err) {
            next(new InternalServerError(err.message));
        }
    },
}