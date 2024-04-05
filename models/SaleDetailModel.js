const { Schema, model } = require("mongoose");

const SaleDetailSchema = Schema({
    sale: {
        type: Schema.ObjectId,
        ref: "Sale"
    },
    product: {
        type: Schema.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number
    },
    discount: {
        type: Number
    }
});

module.exports = model("SaleDetail", SaleDetailSchema, "saleDetails");