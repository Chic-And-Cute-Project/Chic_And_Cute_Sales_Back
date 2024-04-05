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
    sale: [{
        type: Schema.ObjectId,
        ref: "Sale"
    }]
});

module.exports = model("CloseSalesDay", CloseSalesDaySchema, "closeSalesDays");