const { Schema, model } = require("mongoose");

const InventorySchema = Schema({
    sede: {
        type: String
    },
    product: {
        type: Schema.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        default: 0
    }
});

module.exports = model("Inventory", InventorySchema, "inventories");