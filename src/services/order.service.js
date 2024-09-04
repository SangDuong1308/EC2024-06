const { default: mongoose } = require("mongoose");
const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const userModel = require("../models/user.model");
const { getSelectData, removeNestedNullUndefined } = require("../utils");
const productService = require("./product.service");

module.exports = {
    async findOrder(filter, select = []) {
        return await orderModel.findOne(filter).select({...getSelectData(select)}).lean()
    },
    async findOrders(filter, select = []) {
        return await orderModel.find(filter).select({...getSelectData(select)}).lean()
    },
    async countSubPriceOfCart(list_product) {
        let subPrice = 0;
        const select = ["product_sell_price", "product_list_price"];
        for (let product of list_product) {
            const foundProduct = await productModel.findOne({ _id: product.productId, isActive: true}).select(getSelectData(select));
            if (foundProduct) {
                subPrice += foundProduct.product_sell_price * product.quantity;
            }
        }
        return subPrice;
    },
    async getSubOrderInfo(userId, list_product, note) {
        let subPrice = await this.countSubPriceOfCart(list_product);
        
        // to do: shipping fee
        // let shippingFee = await this.getFeeShip(userId);
        
        let totalPrice = subPrice;

        let subOrderInfo = {
            subPrice,
            // shippingFee,
            unit: "VND",
            list_product,
            totalPrice,
        };

        if (note) subOrderInfo = { ...subOrderInfo, note };
        return subOrderInfo;
    },
    async getOrderInfo(userId, address, totalItems, list_products, note, shippingFee) {
        let subPrice = await this.countSubPriceOfCart(list_products)
        console.log("sub price:::", subPrice);

        const selectUser = ["_id", "name", "phoneNumber"];
        const userOrder = await userModel.findById(userId).select(getSelectData(selectUser));

        let orderInfo = {
            order_user: {
                _id: userOrder._id,
                name: userOrder.name,
                phoneNumber: userOrder.phoneNumber,
                address
            },
            subPrice,
            shippingFee,
            unit: "VND",
            list_products,
            totalPrice: subPrice + shippingFee,
            totalItems,
        }
        if (note) orderInfo = { ...orderInfo, note };
        return orderInfo;
    },
    async createOrder(orderInfo) {
        const session = await mongoose.startSession();
        session.startTransaction();
        removeNestedNullUndefined(orderInfo);
        try {
            const orderData = {
                order_user: orderInfo.order_user,
                order_totalPrice: orderInfo.totalPrice,
                order_subPrice: orderInfo.subPrice,
                order_listProducts: orderInfo.list_products,
                order_paymentMethod: orderInfo.paymentMethod,
                order_totalItems: orderInfo.totalItems,
                order_shippingFee: orderInfo.shippingFee,
            };

            if (orderInfo.note) orderData.order_note = orderInfo.note;

            const newOrder = await orderModel.create(orderData);

            for (let product of newOrder.order_listProducts) {
                const update = {
                    $inc: { product_sold: product.quantity },
                };
                await productService.getProductByIdAndUpdate(
                    product.productId,
                    update
                );
            }
            return newOrder;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
}