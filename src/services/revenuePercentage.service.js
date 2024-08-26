const { Schema, model } = require("mongoose");

const revenuePercentageSchema = new Schema({
    shop: { type: Number, default: 20 },
});

revenuePercentageSchema.pre("save", async (next) => {
    try {
        const existingDocumentCount = await revenuePercentage.countDocuments(
            {}
        );
        if (existingDocumentCount > 0) {
            throw new Error("Only one document is allowed in the collection.");
        }
        next();
    } catch (error) {
        next(error);
    }
});

const revenuePercentage = model("RevenuePercentage", revenuePercentageSchema);
module.exports = {
    revenuePercentage,
};
