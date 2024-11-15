const { Schema, model } = require("mongoose");

const DiscountSchema = Schema({
    name: {
        type: String
    },
    quantity: {
        type: Number
    },
    productId: {
        type: String
    }
});

module.exports = model("Discount", DiscountSchema, "discounts");