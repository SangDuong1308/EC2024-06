const { Api404Error, BadRequest, InternalServerError } = require("../constants/error.reponse");
const productService = require("../services/product.service");
const { uploadFileFromLocal } = require("../services/upload.service");
const userService = require("../services/user.service");
const { removeExtInFileName, deleteFileByRelativePath } = require("../utils");

module.exports = {
    async createPoruduct(req, res) {
        let product_data = req.body;

        const { userId: adminId} = req.user

        const foundAdmin = await userService.findById(adminId)

        if (!foundAdmin) {
            throw new Api404Error('AdminId not found')
        }

        let file_path = "";
        if (req.file) {
            const { image_url } = await uploadFileFromLocal(
                req.file.path,
                removeExtInFileName(req.file.filename),
                process.env.CLOUDINARY_SHOP_PRODUCT_PATH
            );
            if (!image_url) {
                deleteFileByRelativePath(req.file.path);
                throw new BadRequest(
                    "Cant upload the product image to cloud please try again"
                );
            }
            file_path = image_url;
        }
        if (file_path)
            product_data = { ...product_data, product_thumb: file_path };

        const createdProduct = await productService.createProduct(
            {
                ...product_data,
            }
        );
        if (!createdProduct) throw new BadRequest("Product failure create");

        res.status(200).json({
            message: "Product Successful Created",
            metadata: createdProduct,
        });
    },
    async updateProduct(req, res) {
        const { productId } = req.query;
        const bodyUpdate = req.body;

        let filepath = "";
        if (req.file) {
            const { image_url } = await uploadFileFromLocal(
                req.file.path,
                removeExtInFileName(req.file.filename),
                process.env.CLOUDINARY_SHOP_PRODUCT_PATH
            );
            if (!image_url) {
                deleteFileByRelativePath(req.file.path);
                throw new BadRequest(
                    "Cant upload the file to cloud please try again"
                );
            }
            filepath = image_url;
        }

        const updatedProduct = await productService.updateProduct({
            productId,
            bodyUpdate,
            product_thumb: filepath,
        });

        if (!updatedProduct) {
            if (req?.file?.path) deleteFileByRelativePath(req.file.path);
            throw new InternalServerError("Product Not Found Or Server Error");
        }
        res.status(200).json({
             message: "Product Successfully Updated", 
             metadata: updatedProduct 
        });
    },
}