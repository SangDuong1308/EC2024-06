const { Schema, model, Types } = require('mongoose');

const DOCUMENT_NAME = 'Category';
const COLLECTION_NAME = 'Categories';

// Declare the Schema of the Mongo model
const categorySchema = new Schema(
    {
        category_name: {
            type: String,
            trim: true,
            // enum: ["Eggless Cakes", "Half Cakes", "Heart Shape Cakes", "Rose Cakes"],
        },
        isActive: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: false,
        collection: COLLECTION_NAME,
    },
);

//Export the model
module.exports = model(DOCUMENT_NAME, categorySchema);