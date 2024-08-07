const { Schema, model, Types } = require('mongoose');

// Declare the Schema of the Mongo model
const productSchema = new Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_price: {
        type: Number,
        required: true,
    },
    product_description: {
        type: String,
        required: true,
    },
    product_image: {
        type: String,
        required: true,
    },
    category: {
        type: Types.ObjectId,
        ref: "Category",
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

//Export the model
module.exports = model("Product", productSchema);