const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
    code: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
});

module.exports = model("Product", ProductSchema, "products");