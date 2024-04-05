const { Schema, model } = require("mongoose");

const RemissionGuideSchema = Schema({
    date: {
        type: Date,
        default: Date.now
    },
    sedeFrom: {
        type: String
    },
    sedeTo: {
        type: String
    },
    product: [{
        type: Schema.ObjectId,
        ref: "Product"
    }],
    status: {
        type: String
    }
});

module.exports = model("RemissionGuide", RemissionGuideSchema, "remissionGuides");