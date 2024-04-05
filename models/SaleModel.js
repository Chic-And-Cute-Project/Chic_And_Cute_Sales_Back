const { Schema, model } = require("mongoose");

const SaleSchema = Schema({
    sede: {
        type: String
    },
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentMethod: [{
        type: {
            type: String
        },
        amount: {
            type: Number
        }
    }]
});

module.exports = model("Sale", SaleSchema, "sales");