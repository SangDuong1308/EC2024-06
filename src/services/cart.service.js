const { Types } = require("mongoose")
const cartModel = require("../models/cart.model")
const { unSelectData } = require("../utils")
const { BadRequest } = require("../constants/error.reponse")

module.exports = {
    async findCartByUserId(userId, unSelect = []) {
        return cartModel.findOne({
            cart_user: new Types.ObjectId(userId),
            cart_state: "active"
        }).select(unSelectData(unSelect))
    },
    async findCartByUserIdAndUpdate(userId, update) {
        return await cartModel.findOneAndUpdate({
            cart_user: new Types.ObjectId(userId)
        }, update, { new: true} )
    },
    async createCart(userId, productToAdd) {
        return cartModel.create({
            cart_products: [productToAdd],
            cart_user: userId,
            cart_count_product: productToAdd.quantity
        })
    },
    async addProductToCart(userId, productToAdd) {
        const { productId, quantity } = productToAdd;
        const filter = {
            cart_user: new Types.ObjectId(userId),
            "cart_products.productId": productId,
        };

        const foundProductInCart = await cartModel.findOne(filter);

        if (foundProductInCart) {
            const update = {
                $inc: {
                    "cart_products.$.quantity": +quantity,
                    cart_count_product: +quantity,
                },
            };
            return await cartModel.findOneAndUpdate(filter, update, {
                new: true,
            });
        } else {
            return await cartModel.findOneAndUpdate(
                { cart_user: new Types.ObjectId(userId) },
                {
                    $push: { cart_products: productToAdd },
                    $inc: { cart_count_product: +quantity },
                },
                { new: true }
            );
        }
    },
    async deleteCartByUserId(userId) {
        const filter = {
            cart_user: new Types.ObjectId(userId),
        };
        return await cartModel.deleteOne(filter);
    },
    async removeProductFromCart(userId, productId) {
        const foundProduct = await cartModel.findOne(
            {
                cart_user: userId,
                "cart_products.productId": new Types.ObjectId(productId),
            },
            {
                cart_products: {
                    $elemMatch: { productId: new Types.ObjectId(productId) },
                },
            }
        );

        const quantity = foundProduct?.cart_products[0]?.quantity;
        if (!quantity) throw new BadRequest("Product may be not exist in cart");

        const filter = { cart_user: userId };
        const update = {
            $pull: {
                cart_products: { productId: new Types.ObjectId(productId) },
            },
            $inc: {
                cart_count_product: quantity * -1,
            },
        };
        return await cartModel.findOneAndUpdate(filter, update, { new: true });
    },
    async decProductQuantity(userId, productId) {
        const filter = {
            cart_user: userId,
            "cart_products.productId": new Types.ObjectId(productId),
            "cart_products.quantity": { $gt: 1 },
        };
        const update = {
            $inc: {
                "cart_products.$.quantity": -1,
                cart_count_product: -1
            }
        }
        return await cartModel.findOneAndUpdate(filter, update, { new: true })
    },
    async incProductQuantity(userId, productId) {
        const filter = {
            cart_user: userId,
            "cart_products.productId": new Types.ObjectId(productId),
        };
        const update = {
            $inc: {
                "cart_products.$.quantity": 1,
                cart_count_product: 1
            }
        }
        return await cartModel.findOneAndUpdate(filter, update, { new: true });
    }
}