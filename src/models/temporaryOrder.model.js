const { Schema, Types, model } = require("mongoose");

const DOCUMENT_NAME = 'TempOrder';
const COLLECTION_NAME = 'TempOrders';

const temporaryOrderSchema = new Schema({
        order_id: { type: Types.ObjectId, ref: "Order" },
        order_info: { type: Object },
        app_trans_id: { type: String },
        time: { type: Date, default: Date.now, index: { expires: 120 } },
    }, 
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = model(DOCUMENT_NAME, temporaryOrderSchema);