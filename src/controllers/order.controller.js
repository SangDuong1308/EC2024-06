const { SHOP_LOCATION } = require("../constants");
const { Api404Error, InternalServerError, BadRequest } = require("../constants/error.reponse");
const cartService = require("../services/cart.service");
const orderService = require("../services/order.service");
const paymentService = require("../services/payment.service");
const { findShippingFee, distanceBetweenTwoPoints } = require("../utils");

module.exports = {
    async checkoutReview(req, res) {
        const { userId } = req.user;

        const foundCart = await cartService.findCartByUserId(userId);
        if (!foundCart || !foundCart?.cart_products) throw new Api404Error("Cart not found");

        const orderInfo = await orderService.getSubOrderInfo(userId, foundCart.cart_products, foundCart.cart_note);

        if (!orderInfo) throw new InternalServerError("Create order failed");
        res.status(200).json({
            message: "Get order review successfully",
            metadata: orderInfo,
        })

    },
    async getOrderDetail(req, res) {
        const { userId } = req.user;
        const role = req.user.role;
        const { orderId } = req.query;

        let filter = {};
        let order = {};

        if (role === "user") {
            filter = {
                "order_user._id": userId,
                _id: orderId,
            }
        } else if (role === "admin") {
            filter = {
                _id: orderId,
            }
        }
        order = await orderService.findOrder(filter);
        console.log("orderShop or user:::", order);

        if (!order) {
            throw new Api404Error("Order not found");
        }
        res.status(200).json({
            message: "Get order detail successfully",
            metadata: {
                order
            },
        })
    },
    // middleware for cash | vnpay
    async checkoutPreProcess(req, res, next) {
        const { userId } = req.user;
        const { type, latlng, street } = req.body;
        if (!type || !latlng || !street)
            next(new BadRequest(`Missing type | latlng | street in req.body`));

        const address = {
            type,
            latlng,
            street,
        };
        const foundCart = await cartService.findCartByUserId(userId);
        if (
            !foundCart ||
            !foundCart.cart_products ||
            !foundCart?.cart_products.length
        )
            next(new Api404Error("Cart Not Found Or Empty"));
        console.log("foundCart.cart_products:::", foundCart.cart_products);

        console.log("==========");
        console.log(latlng.lat);
        console.log(latlng.lng);
        console.log(SHOP_LOCATION.Lat);
        console.log(SHOP_LOCATION.Lng);
        console.log("==========");

        const distanceShopUser = distanceBetweenTwoPoints(
            latlng.lat,
            latlng.lng,
            SHOP_LOCATION.Lat,
            SHOP_LOCATION.Lng
        );

        const shippingFee = findShippingFee(distanceShopUser);
        if (shippingFee == null)
            next(new BadRequest(`So far to ship ${distanceShopUser}km`));

        console.log("shippingFee::", shippingFee);
        console.log("distanceShopUser::", distanceShopUser);

        const orderInfo = await orderService.getOrderInfo(
            userId,
            address,
            foundCart.cart_count_product,
            foundCart.cart_products,
            foundCart.cart_note,
            shippingFee
        );

        if (!orderInfo) throw new InternalServerError("Create Order Failure");
        req.orderInfo = orderInfo;
        next();
    },
    async checkoutCash(req, res) {
        const orderInfo = req.orderInfo;
        orderInfo.paymentMethod = "cash";

        const createdOrder = await orderService.createOrder(orderInfo);

        if (!createdOrder) throw new InternalServerError("Create order failed");

        console.log("createdOrder with cash:::", createdOrder);
        res.status(201).json({
            message: "Create order successfully",
        })
    },
    async getVnpUrl(req, res) {
        const VnpUrl = paymentService.getVnpUrl(req);
        // res.status(200).send(VnpUrl);
        console.log("VnpUrl:::", VnpUrl);
        res.status(200).redirect(VnpUrl);
    },
    async handleVnpReturn(req, res) {
        const result = paymentService.getVnPayResult(req);
        // res.status(200).send(result);
        const redirectUrl = process.env.REDIRECT_LINK;
        console.log("Redirect link:::", redirectUrl);
        if (result.code === "00") {
            res.redirect(redirectUrl);
        } else {
            res.redirect(redirectUrl);
        }
    }
}