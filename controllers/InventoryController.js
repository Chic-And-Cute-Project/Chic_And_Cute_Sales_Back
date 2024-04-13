const Inventory = require("../models/InventoryModel");
const User = require("../models/UserModel");

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const create = async (req, res) => {
    let inventoryBody = req.body;

    if (!inventoryBody.sede || !inventoryBody.product) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    let inventoryData = {
        sede: inventoryBody.sede,
        product: inventoryBody.product
    }

    let inventory_to_save = new Inventory(inventoryData);

    try {
        const inventoryStored = await inventory_to_save.save();

        if (!inventoryStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No inventory saved"
            });
        }

        return res.status(200).json({
            "status": "success",
            "message": "Inventario creado",
            "inventory": inventoryStored
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving inventory",
            error
        });
    }
}

const list = (_req, res) => {
    Inventory.find().then(inventories => {
        if (!inventories) {
            return res.status(404).json({
                status: "Error",
                message: "No inventories avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            inventories
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getBySede = (req, res) => {
    let sede = req.query.sede;

    Inventory.find({ sede: sede }).populate('product').then(inventories => {
        if (!inventories) {
            return res.status(404).json({
                status: "Error",
                message: "No inventories avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            inventories
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const update = (req, res) => {
    let id = req.query.idInventory;

    Inventory.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(inventoryUpdated => {
        if (!inventoryUpdated) {
            return res.status(404).json({
                status: "error",
                mensaje: "Inventory not found"
            });
        }
        return res.status(200).send({
            status: "success",
            inventory: inventoryUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and updating inventory"
        });
    });
}

const getByMySede = async (req, res) => {
    let userId = new ObjectId(req.user.id);
    let sede;

    try {
        const user = await User.findOne({ _id: userId });
      
        if (!user) {
          return res.status(404).json({
            status: "Error",
            message: "No user available..."
          });
        }
      
        sede = user.sede;
      
    } catch (error) {
        return res.status(500).json({
          status: "error",
          error
        });
    }

    Inventory.find({ sede: sede }).populate('product').then(inventories => {
        if (!inventories) {
            return res.status(404).json({
                status: "Error",
                message: "No inventories avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            inventories
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getAvailableBySede = (req, res) => {
    let sede = req.query.sede;

    Inventory.find({ sede: sede, quantity: { $ne: 0 } }).populate('product').then(inventories => {
        if (!inventories) {
            return res.status(404).json({
                status: "Error",
                message: "No inventories avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            inventories
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

module.exports = {
    create,
    list,
    getBySede,
    update,
    getByMySede,
    getAvailableBySede
}