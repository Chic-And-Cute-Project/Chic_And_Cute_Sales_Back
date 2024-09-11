const User = require("../models/UserModel");

const bcrypt = require("bcrypt");
const jwt = require("../authorization/jwt");

const register = async (req, res) => {
    let userBody = req.body;

    if (!userBody.name || !userBody.lastName || !userBody.username || !userBody.password) {
        return res.status(400).json({
            "message": "Faltan datos"
        });
    }

    let userData = {
        username: userBody.username,
        password: userBody.password,
        name: userBody.name,
        lastName: userBody.lastName
    }

    try {
        const userAlreadyExist = await User.find({ username: userData.username });

        if (userAlreadyExist.length >= 1) {
            return res.status(400).json({
                "message": "El usuario ya existe"
            });
        }

        let pwd = await bcrypt.hash(userData.password, 10);
        userData.password = pwd;

        let user_to_save = new User(userData);

        try {
            const userStored = await user_to_save.save();

            if (!userStored) {
                return res.status(500).json({
                    "message": "No user saved"
                });
            }

            return res.status(200).json({
                "message": "Usuario registrado"
            });

        } catch {
            return res.status(500).json({
                "message": "Error while saving user"
            });
        }
    } catch {
        return res.status(500).json({
            "message": "Error while finding user duplicate"
        });
    }
}

const loginUser = (req, res) => {
    let userBody = req.body;

    if (!userBody.username || !userBody.password) {
        return res.status(400).json({
            "message": "Faltan datos"
        });
    }

    User.findOne({ username: userBody.username }).then(user => {
        if (!user) {
            return res.status(400).json({
                "message": "Usuario no existe"
            });
        }

        let pwd = bcrypt.compareSync(userBody.password, user.password);

        if (!pwd) {
            return res.status(400).json({
                "message": "Contraseña incorrecta"
            });
        }

        const token = jwt.createToken(user);

        return res.status(200).json({
            token,
            "role": user.role
        });

    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding user"
        });
    });
}

const profile = (req, res) => {
    User.findById(req.user.id).select({ password: 0 }).then(user => {
        if (!user) {
            return res.status(404).json({
                "message": "User doesn't exist"
            });
        }

        return res.status(200).json({
            user
        });
    }).catch(() => {
        return res.status(404).json({
            "message": "Error while finding user"
        });
    });
}

const getAllUserSales = (_req, res) => {
    User.find({ role: { $ne: "Admin" } }).then(users => {
        if (!users) {
            return res.status(404).json({
                "message": "No users avaliable..."
            });
        }

        return res.status(200).json({
            users
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding users"
        });
    });
}

const updateUser = (req, res) => {
    let id = req.query.idUser;

    User.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(userUpdated => {
        if (!userUpdated) {
            return res.status(404).json({
                mensaje: "User not found"
            });
        }
        return res.status(200).send({
            user: userUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            mensaje: "Error while finding and updating user"
        });
    });
}

const searchUserSales = (req, res) => {
    User.find({ role: { $ne: "Admin" }, name: { $regex: req.query.userName, $options: 'i' } }).then(users => {
        if (!users) {
            return res.status(404).json({
                "message": "No users avaliable..."
            });
        }

        return res.status(200).json({
            users
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding users"
        });
    });
}

module.exports = {
    register,
    loginUser,
    profile,
    getAllUserSales,
    updateUser,
    searchUserSales
}