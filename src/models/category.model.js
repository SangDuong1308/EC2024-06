const { Schema, model, Types } = require('mongoose');

// Declare the Schema of the Mongo model
const categorySchema = new Schema({
    category_name: {
        type: String,
        enum: ["Eggless Cakes", "Photo Cakes", "Half Cakes", "Heart Shape Cakes", "Rose Cakes"],
    },
});

//Export the model
module.exports = model("Category", categorySchema);