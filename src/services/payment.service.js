const moment = require('moment');
const querystring = require('qs');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const axios = require('axios');
const configVnpay = require('../configs/config.vnpay');
require('dotenv').config();
const chalk = require('chalk');


module.exports = {
    getVnpUrl(req){
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');

        let ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let tmnCode = configVnpay.vnp_TmnCode;
        let secretKey = configVnpay.vnp_HashSecret;
        let vnpUrl = configVnpay.vnp_Url;
        let returnUrl = configVnpay.vnp_ReturnUrl;
        let orderId = moment(date).format("DDHHmmss");
        let amount = req.amount;
        let bankCode = "";

        let locale = "vn";
        let currCode = "VND";
        let vnp_Params = {};
        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        vnp_Params["vnp_Locale"] = locale;
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = orderId;
        vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
        vnp_Params["vnp_OrderType"] = "other";
        vnp_Params["vnp_Amount"] = amount * 100;
        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;
        if (bankCode !== null && bankCode !== "") {
            vnp_Params["vnp_BankCode"] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

        return {
          vnpUrl,
          orderId: orderId,
        };
    },

    getVnPayResult(req) {
        let vnp_Params = req.query;
        let secureHash = vnp_Params["vnp_SecureHash"];

        // delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        vnp_Params = sortObject(vnp_Params);

        let tmnCode = configVnpay.vnp_TmnCode;
        let secretKey = configVnpay.vnp_HashSecret;

        let signData = querystring.stringify(vnp_Params, { encode: false });

        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

        if (secureHash === signed) {
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
            return {
                message: "successfully",
                code: vnp_Params["vnp_ResponseCode"],
            };
        } else {
            return {
                message: "success",
                code: "97",
            };
        }
    },

    getVnpIpn(req) {
        var vnp_Params = req.query;
        var secureHash = vnp_Params['vnp_SecureHash'];
    
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
    
        vnp_Params = sortObject(vnp_Params);
        var secretKey = configVnpay.vnp_HashSecret;
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");     
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
         
    
        if(secureHash === signed){
            var orderId = vnp_Params['vnp_TxnRef'];
            var rspCode = vnp_Params['vnp_ResponseCode'];
            //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
            // res.status(200).json({RspCode: '00', Message: 'success'})
            return {
                // RspCode: '00',
                RspCode: rspCode,
                OrderId: orderId,
                Message: 'success'
            }
        }
        else {
            // res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
            return {
                RspCode: '97',
                Message: 'Fail checksum'
            }
        }
    },
    
    async getZaloPayUrl(
        items,
        amount,
        desc="",
    ) {
        const config = {
            app_id: process.env.ZALOPAY_APPID,
            key1: process.env.ZALOPAY_KEY1,
            key2: process.env.ZALOPAY_KEY2,
            endpoint: process.env.ZALOPAY_ENDPONIT
        }

        const embed_data = {
            redirecturl: process.env.ZALOPAY_REDIRECT,
        }

        const transID = Math.floor(Math.random() * 1000000);
        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
            app_user: "user123",
            app_time: Date.now(), // miliseconds
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount,
            description:
                desc || `Payment for the order #${transID}`,
            bank_code: "",
            callback_url: process.env.ZALOPAY_CALLBACK,
        };

        // appid|app_trans_id|appuser|amount|apptime|embeddata|item
        const data =
            config.app_id +
            "|" +
            order.app_trans_id +
            "|" +
            order.app_user +
            "|" +
            order.amount +
            "|" +
            order.app_time +
            "|" +
            order.embed_data +
            "|" +
            order.item;
        console.log("data:::", data);
        console.log("config:::", config);
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        try {
            const result = await axios.post(config.endpoint, null, {
                params: order,
            });
            return { ...result.data, app_trans_id: order.app_trans_id };
        } catch (err) {
            console.error("Error in getZaloPayUrl", err);
            throw new Error(err.message);
        }
    },
}

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
            /%20/g,
            "+"
        );
    }
    return sorted;
}