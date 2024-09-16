const { Schema, model } = require("mongoose");

const CloseSalesDaySchema = Schema({
    date: {
        type: Date,
        default: Date.now
    },
    sede: {
        type: String
    },
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    sales: [{
        type: Schema.ObjectId,
        ref: "Sale"
    }],
    cashAmount: {
        type: Number
    },
    cardAmount: {
        type: Number
    }
});

module.exports = model("CloseSalesDay", CloseSalesDaySchema, "closeSalesDays");