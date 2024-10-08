const { Schema, model, Types } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
    {
        product_name: { 
            type: String, 
            required: true 
        },
        product_thumb: { 
            type: String, 
            required: true 
        },
        image_sources: [{
            type: String,
        }],
        product_description: { 
            type: String, 
            required: true 
        },
        product_category: {
            type: Types.ObjectId,
            ref: "Category",
            required: true,
        },
        product_weight: {
            type: Number,
            enum: [0.5, 1, 1.5, 2, 4]
        },
        product_quantity: { 
            type: Number,
        },
        product_sell_price: { 
            type: Number, 
            require: true 
        },
        product_list_price: { 
            type: Number, 
            require: true 
        },
        eggless: {
            type: Boolean,
            default: false
        },
        preparation_time: {
            type: Number,
            default: null
        },
        product_sold: {
            type: Number,
            default: 0
        },
        product_like: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

productSchema.index({ product_name: 'text', product_description: 'text' });

//Export the model
module.exports = model(DOCUMENT_NAME, productSchema);