const { BadRequest, Api404Error, InternalServerError } = require("../constants/error.reponse");
const cartService = require("../services/cart.service");
const productService = require("../services/product.service");

module.exports = {
    async getCart(req, res) {
        const { userId } = req.user;

        const unSelect = [
            "createdOn",
            "modifiedOn",
            "cart_user",
            "__v",
        ]

        const cart = await cartService.findCartByUserId(userId, unSelect);

        console.log("cart::", cart);
        if (!cart)
            return res
                .status(404)
                .json({ message: "Cart Not Found", metadata: null });

        return res
            .status(200)
            .json({ message: "Successfully", metadata: cart });
    },
    async addProductToCart(req, res) {
        const { userId } = req.user;
        const { productId, quantity = 1 } = req.query;

        if (!productId) throw new BadRequest("Missing productId");
        if (quantity < 0)
            throw new BadRequest("Quantity should be greater than 0");

        const foundProduct = await productService.checKExistProduct(productId);
        if (!foundProduct) throw new Api404Error("Product Not Found");

        const foundCart = await cartService.findCartByUserId(userId);

        const productToAdd = {
            productId: foundProduct._id,
            name: foundProduct.product_name,
            sell_price: foundProduct.product_sell_price,
            image: foundProduct.product_thumb,
            quantity: +quantity,
        };
        if (!foundCart) {
            const newCart = await cartService.createCart(
                userId,
                productToAdd
            );
            if (!newCart)
                throw new InternalServerError("Error while creating cart");
            return res.status(200).json({
                message: "Product Successfully Added to Cart",
                metadata: newCart,
            });
        } else {
            if (!foundCart?.cart_products?.length) {
                foundCart.cart_products = [productToAdd];
                foundCart.cart_count_product = productToAdd.quantity;
                await foundCart.save();
            } else {
                const result = await cartService.addProductToCart(
                    userId,
                    productToAdd
                );
                if (!result)
                    throw InternalServerError(
                        "Error while adding product to cart"
                    );
            }
        }
        res.status(200).json({
            message: "Product Successfully Added to Cart"
        });
    },
    async deleteCart(req, res) {
        const { userId } = req.user;
        const { deletedCount } = await cartService.deleteCartByUserId(userId);
        if (!deletedCount) throw new Api404Error("Cart not found");
        res.status(200).json({ message: "Cart Successfully Deleted" });
    },
    async createNote(req, res) {
        const {userId} = req.user;
        const { note } = req.body;

        if (!note) throw new BadRequest("Missing note");

        const update = {
            $set: {
                cart_note: note,
            }
        };

        const cart = await cartService.findCartByUserIdAndUpdate(userId, update);

        if (!cart) throw new Api404Error("Cart not found");

        res.status(200).json({ message: "Note Successfully Added", metadata: cart });
    },
    async removeProductFromCart(req, res) {
        const { userId } = req.user;
        const { productId } = req.params;

        if (!productId) throw new BadRequest("Missing productId");

        const modifiedCart = await cartService.removeProductFromCart(userId, productId);

        res.status(200).json({
            message: "Product Successfully Removed",
            metadata: modifiedCart,
        })
    },
    async decProductQuantity(req, res) {
        const { userId } = req.user;
        const { productId } = req.params;
        if (!productId) throw new BadRequest("Missing required arguments");

        let updatedCart = await cartService.decProductQuantity(
            userId,
            productId
        );

        if (!updatedCart)
            updatedCart = await cartService.removeProductFromCart(
                userId,
                productId
            );
        res.status(200).json({
            message: "Cart Successfully Updated",
            metadata: updatedCart,
        });
    },

    async incProductQuantity(req, res) {
        const { userId } = req.user;
        const { productId } = req.params;
        console.log("watch me here", productId);

        if (!productId) throw new BadRequest("Missing required argument");

        const updatedCart = await cartService.incProductQuantity(
            userId,
            productId
        );

        if (!updatedCart) throw new BadRequest("Product not exist in cart");
        res.status(200).json(updatedCart);
    },
}