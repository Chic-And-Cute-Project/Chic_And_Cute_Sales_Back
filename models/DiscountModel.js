const { Schema, model } = require("mongoose");

const DiscountSchema = Schema({
    name: {
        type: String
    },
    quantity: {
        type: Number
    }
});

module.exports = model("Discount", DiscountSchema, "discounts");