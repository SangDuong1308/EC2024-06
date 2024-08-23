const { Schema, Types, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

var cartSchema = new Schema({
        cart_state: {
            type: String,
            required: true,
            enum: ["active", "completed", "failed", "pending"],
            default: "active",
        },

        cart_products: { 
            type: Array, required: true 
        },
        cart_note: { 
            type: String 
        },
        cart_count_product: { 
            type: Number, default: 0 
        },
        cart_user: { 
            type: Types.ObjectId, required: true, ref: "User" 
        }
    },
    {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "modifiedOn",
        },
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);