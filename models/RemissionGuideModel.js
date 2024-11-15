const { Schema, model } = require("mongoose");

const RemissionGuideSchema = Schema({
    date: {
        type: Date
    },
    sedeFrom: {
        type: String
    },
    sedeTo: {
        type: String
    },
    products: [
        {
            product: {
                type: Schema.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number
            }
        }
    ],
    status: {
        type: String,
        default: "Pendiente"
    },
    identifier: {
        type: String
    }
});

module.exports = model("RemissionGuide", RemissionGuideSchema, "remissionGuides");