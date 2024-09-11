const Inventory = require("../models/InventoryModel");
const User = require("../models/UserModel");

const create = async (req, res) => {
    let inventoryBody = req.body;

    if (!inventoryBody.sede || !inventoryBody.product) {
        return res.status(400).json({
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
                "message": "No inventory saved"
            });
        }

        return res.status(200).json({
            "inventory": inventoryStored
        });
    } catch (error) {
        return res.status(500).json({
            "message": "Error while saving inventory"
        });
    }
}

const getBySede = (req, res) => {
    let sede = req.query.sede;

    Inventory.find({ sede: sede }).populate('product').then(inventories => {
        if (!inventories) {
            return res.status(404).json({
                "message": "No inventories avaliable..."
            });
        }

        return res.status(200).json({
            inventories
        });
    }).catch(error => {
        return res.status(500).json({
            "message": "Error while finding inventories"
        });
    });
}

const update = (req, res) => {
    let id = req.query.idInventory;

    Inventory.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(inventoryUpdated => {
        if (!inventoryUpdated) {
            return res.status(404).json({
                "mensaje": "Inventory not found"
            });
        }
        return res.status(200).send({
            inventory: inventoryUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            "mensaje": "Error while finding and updating inventory"
        });
    });
}

const getByMySede = async (req, res) => {
    let userId = req.user.id;
    let sede;

    try {
        const user = await User.findOne({ _id: userId });
      
        if (!user) {
          return res.status(404).json({
            "message": "No user available..."
          });
        }
      
        sede = user.sede;
      
    } catch (error) {
        return res.status(500).json({
            "message": "Error while finding user"
        });
    }

    Inventory.find({ sede: sede }).populate('product').then(inventories => {
        if (!inventories) {
            return res.status(404).json({
                "message": "No inventories avaliable..."
            });
        }

        return res.status(200).json({
            inventories
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding inventories"
        });
    });
}

const getAvailableBySede = (req, res) => {
    let sede = req.query.sede;

    Inventory.find({ sede: sede, quantity: { $ne: 0 } }).populate('product').then(inventories => {
        if (!inventories) {
            return res.status(404).json({
                "message": "No inventories avaliable..."
            });
        }

        return res.status(200).json({
            inventories
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding inventories"
        });
    });
}

const searchProductBySede = (req, res) => {
    let sede = req.query.sede;
    let productName = req.query.productName;

    Inventory.find({ sede: sede }).populate({ path: 'product', match: { fullName: { $regex: productName, $options: 'i' } } }).then(inventories => {
        inventories = inventories.filter(inventory => inventory.product);
        if (!inventories) {
            return res.status(404).json({
                "message": "No inventories avaliable..."
            });
        }

        return res.status(200).json({
            inventories
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding inventories"
        });
    });
}

const searchProductsByMySede = async (req, res) => {
    let userId = req.user.id;
    let productName = req.query.productName;
    let sede;

    try {
        const user = await User.findOne({ _id: userId });
      
        if (!user) {
          return res.status(404).json({
            "message": "No user available..."
          });
        }
        
        sede = user.sede;
      
    } catch (error) {
        return res.status(500).json({
            "message": "Error while finding user"
        });
    }
    
    Inventory.find({ sede: sede }).populate({ path: 'product', match: { fullName: { $regex: productName, $options: 'i' } } }).then(inventories => {
        inventories = inventories.filter(inventory => inventory.product);
        if (!inventories) {
            return res.status(404).json({
                "message": "No inventories avaliable..."
            });
        }

        return res.status(200).json({
            inventories
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding inventories"
        });
    });
}

module.exports = {
    create,
    getBySede,
    update,
    getByMySede,
    getAvailableBySede,
    searchProductBySede,
    searchProductsByMySede
}