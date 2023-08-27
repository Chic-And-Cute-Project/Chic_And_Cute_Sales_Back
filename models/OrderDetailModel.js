const { Schema, model } = require("mongoose");

const OrderDetailSchema = Schema({
    order: {
        type: Schema.ObjectId,
        ref: "Order",
        required: true
    },
    product: {
        type: Schema.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    totalPrice: {
        type: String,
        required: true
    }
});

module.exports = model("OrderDetail", OrderDetailSchema, "orderDetails");