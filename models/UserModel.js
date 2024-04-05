const { Schema, model } = require("mongoose");

const UserSchema = Schema({
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: "Vendedor"
    },
    sede: {
        type: String,
        default: "Sin sede asignada"
    }
});

module.exports = model("User", UserSchema, "users");