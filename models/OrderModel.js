const { Schema, model } = require("mongoose");

const OrderSchema = Schema({
    sede: {
        type: Schema.ObjectId,
        ref: "Sede",
        required: true
    },
    finalPrice: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = model("Order", OrderSchema, "orders");