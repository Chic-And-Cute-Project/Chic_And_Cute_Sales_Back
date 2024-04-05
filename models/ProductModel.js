const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
    code: {
        type: String
    },
    fullName: {
        type: String
    },
    price: {
        type: Number
    }
});

module.exports = model("Product", ProductSchema, "products");