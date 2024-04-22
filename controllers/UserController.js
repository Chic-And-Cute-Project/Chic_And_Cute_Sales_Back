const User = require("../models/UserModel");

const bcrypt = require("bcrypt");
const jwt = require("../authorization/jwt");

const register = async (req, res) => {
    let userBody = req.body;

    if (!userBody.name || !userBody.lastName || !userBody.username || !userBody.password) {
        return res.status(400).json({
            "status": "error",
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
                "status": "error",
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
                    "status": "error",
                    "message": "No user saved"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Usuario registrado",
                "user": userStored
            });

        } catch {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving user"
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding user duplicate"
        });
    }
}

const loginUser = (req, res) => {
    let userBody = req.body;

    if (!userBody.username || !userBody.password) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    User.findOne({ username: userBody.username }).then(user => {
        if (!user) {
            return res.status(400).json({
                "status": "error",
                "message": "Usuario no existe"
            });
        }

        let pwd = bcrypt.compareSync(userBody.password, user.password);

        if (!pwd) {
            return res.status(400).json({
                "status": "error",
                "message": "Contraseña incorrecta"
            });
        }

        const token = jwt.createToken(user);

        return res.status(200).json({
            "status": "success",
            "message": "Te haz identificado correctamente",
            "user": {
                "_id": user._id,
                "username": user.username,
                "role": user.role
            },
            token
        });

    }).catch(() => {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding user"
        });
    });
}

const profile = (req, res) => {
    User.findById(req.user.id).select({ password: 0 }).then(user => {
        if (!user) {
            return res.status(404).json({
                "status": "error",
                "message": "User doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "user": user
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding user"
        });
    });
}

const getAllSales = (_req, res) => {
    User.find({ role: { $ne: "Admin" } }).then(users => {
        if (!users) {
            return res.status(404).json({
                status: "Error",
                message: "No users avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            users
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const updateUser = (req, res) => {
    let id = req.query.idUser;

    User.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(userUpdated => {
        if (!userUpdated) {
            return res.status(404).json({
                status: "error",
                mensaje: "User not found"
            });
        }
        return res.status(200).send({
            status: "success",
            user: userUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and updating user"
        });
    });
}

const searchSales = (req, res) => {
    User.find({ role: { $ne: "Admin" }, name: { $regex: req.query.userName, $options: 'i' } }).then(users => {
        if (!users) {
            return res.status(404).json({
                status: "Error",
                message: "No users avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            users
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

module.exports = {
    register,
    loginUser,
    profile,
    getAllSales,
    updateUser,
    searchSales
}