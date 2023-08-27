const { Schema, model } = require("mongoose");

const SedeSchema = Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = model("Sede", SedeSchema, "sedes");