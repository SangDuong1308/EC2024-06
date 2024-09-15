const { log } = require("console");
const { SHOP_LOCATION } = require("../constants");
const { Api404Error, InternalServerError, BadRequest } = require("../constants/error.reponse");
const temporaryOrderModel = require("../models/temporaryOrder.model");
const cartService = require("../services/cart.service");
const orderService = require("../services/order.service");
const paymentService = require("../services/payment.service");
const { findShippingFee, distanceBetweenTwoPoints } = require("../utils");
const CryptoJS = require("crypto-js");

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
    async getOrderByUser(req, res){
        const { userId } = req.user;
        let filter = {
            "order_user._id": userId,
        }

        let orders = await orderService.findOrders(filter);

        if(!orders){
            throw new Api404Error("Order not found");
        }

        res.status(200).json({
            message: "Get order detail successfully",
            metadata:  orders
           
        })
    },
    // middleware for cash | vnpay
    async checkoutPreProcess(req, res, next) {
        const { userId } = req.user;
        const { type, latlng, address } = req.body;
        console.log('Address;:',address);
        // if (!type || !latlng || !street)
        //     next(new BadRequest(`Missing type | latlng | street in req.body`));

        // const address = {
        //     type,
        //     latlng,
        //     street,
        // };
        const foundCart = await cartService.findCartByUserId(userId);
        if (
            !foundCart ||
            !foundCart.cart_products ||
            !foundCart?.cart_products.length
        )
            next(new Api404Error("Cart Not Found Or Empty"));
        console.log("foundCart.cart_products:::", foundCart.cart_products);

        // console.log("==========");
        // console.log(latlng.lat);
        // console.log(latlng.lng);
        // console.log(SHOP_LOCATION.Lat);
        // console.log(SHOP_LOCATION.Lng);
        // console.log("==========");

        // const distanceShopUser = distanceBetweenTwoPoints(
        //     latlng.lat,
        //     latlng.lng,
        //     SHOP_LOCATION.Lat,
        //     SHOP_LOCATION.Lng
        // );

        const shippingFee = 0;
        // if (shippingFee == null)
        //     next(new BadRequest(`So far to ship ${distanceShopUser}km`));

        // console.log("shippingFee::", shippingFee);
        // console.log("distanceShopUser::", distanceShopUser);

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
            metadata: createdOrder,
            message: "Create order successfully",
        })
    },

    async checkoutZalo(req, res) {
        const orderInfo = req.orderInfo;
        orderInfo.paymentMethod = "zalopay";
        console.log("orderInfo.totalPrice:::", orderInfo);

        try {
            const result = await paymentService.getZaloPayUrl(
                orderInfo.list_products,
                orderInfo.totalPrice
            );
            console.log('Result',result);
            //1. tao ra 1 don hang tam trong 15 phut
            // check result thanh cong hay chua
            const expiryTime = new Date();
            expiryTime.setMinutes(expiryTime.getMinutes() + 15);

            await temporaryOrderModel.create({
                order_info: orderInfo,
                app_trans_id: result.app_trans_id,
                time: expiryTime,
            });
            console.log("result order::", result);
            res.status(200).json({
                message: "Success",
                metadata: result.order_url || "",
            });
        } catch (err) {
            console.log("Error occurred when access payment gateway:", err);
            throw new BadRequest("Error occurred when access payment gateway");
        }
    },

    async handleZalopayCallback(req, res) {
        const config = {
            key2: process.env.ZALOPAY_KEY2,
        };

        let result = {};

        try {
            let dataStr = req.body.data;
            let reqMac = req.body.mac;

            let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
            console.log("mac =", mac);

            // kiểm tra callback hợp lệ (đến từ ZaloPay server)
            if (reqMac !== mac) {
                // callback không hợp lệ
                result.return_code = -1;
                result.return_message = "mac not equal";
            } else {
                // thanh toán thành công
                // merchant cập nhật trạng thái cho đơn hàng
                let dataJson = JSON.parse(dataStr, config.key2);
                console.log(
                    "update order's status = success where app_trans_id =",
                    dataJson["app_trans_id"]
                );
                console.log("dataJson:::", dataJson);

                const tempOrder = await temporaryOrderModel.findOneAndDelete({
                    app_trans_id: dataJson.app_trans_id,
                });
                if (!tempOrder || !tempOrder.order_info)
                    throw new BadRequest("Order Expired, Please try again");

                const createdOrder = await orderService.createOrder(
                    tempOrder.order_info
                );

                result.return_code = 1;
                result.return_message = "success";
            }
        } catch (ex) {
            result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
            result.return_message = ex.message;
        }

        // thông báo kết quả cho ZaloPay server
        res.json(result);
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