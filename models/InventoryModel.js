const { Schema, model } = require("mongoose");

const InventorySchema = Schema({
    sede: {
        type: Schema.ObjectId,
        ref: "Sede",
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
});

module.exports = model("Inventory", InventorySchema, "inventories");