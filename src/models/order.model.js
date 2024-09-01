const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const userOrderSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String },
    phoneNumber: { type: String, required: true },
    address: { type: Object, required: true },
});

const orderSchema = new Schema(
    {
        order_state: {
            type: String,
            enum: ["pending", "shipping", "success", "failure"],
            default: "pending",
        },
        order_user: {
            type: userOrderSchema,
            required: true,
        },
        order_shippingFee: {
            type: Number,
            required: true,
        },
        order_totalPrice: { type: Number, required: true },
        order_subPrice: { type: Number, required: true },
        order_listProducts: { type: Array, required: true },
        order_totalItems: { type: Number, required: true },
        order_note: String,
        order_paymentMethod: {
            type: String,
            enum: ["cash", "vnpay", "zalopay"],
            required: true,
        },
        order_finishAt: {
            type: Date,
        },
    },
    { 
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

orderSchema.pre("save", function (next) {
    const currentDate = new Date();
    const currentTimezone = "Asia/Ho_Chi_Minh";
    const currentUserDate = moment(currentDate)
        .tz(currentTimezone)
        .format("YYYY-MM-DD HH:mm:ss");

    this.updatedAt = currentUserDate;
    if (!this.createdAt) {
        this.createdAt = currentUserDate;
    }
    next();
});

module.exports = model(DOCUMENT_NAME, orderSchema);
