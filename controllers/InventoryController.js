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
    let page = Number(req.query.page);
    let skipvalue = page == 0 ? 0 : page * 10;

    Inventory.find({ sede: sede }).populate('product').limit(10).skip(skipvalue).then(inventories => {
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

const getCountBySede = (req, res) => {
    let sede = req.query.sede;

    Inventory.countDocuments({ sede: sede }).then(count => {
        return res.status(200).json({
            count
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while getting products counter"
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
    let page = Number(req.query.page);
    let skipvalue = page == 0 ? 0 : page * 10;

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

    Inventory.find({ sede: sede }).populate('product').limit(10).skip(skipvalue).then(inventories => {
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

const getCountByMySede = async (req, res) => {
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

    Inventory.countDocuments({ sede: sede }).then(count => {
        return res.status(200).json({
            count
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while getting products counter"
        });
    });
}

const getAvailableBySede = (req, res) => {
    let sede = req.query.sede;
    let page = Number(req.query.page);
    let skipvalue = page == 0 ? 0 : page * 10;

    Inventory.find({ sede: sede, quantity: { $ne: 0 } }).populate('product').limit(10).skip(skipvalue).then(inventories => {
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

const getCountBySedeAndAvailable = (req, res) => {
    let sede = req.query.sede;

    Inventory.countDocuments({ sede: sede, quantity: { $ne: 0 } }).then(count => {
        return res.status(200).json({
            count
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while getting products counter"
        });
    });
}

const getAvailableByMySede = async (req, res) => {
    let userId = req.user.id;
    let sede;
    let page = Number(req.query.page);
    let skipvalue = page == 0 ? 0 : page * 10;

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

    Inventory.find({ sede: sede, quantity: { $ne: 0 } }).populate('product').limit(10).skip(skipvalue).then(inventories => {
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

const getCountByMySedeAndAvailable = async (req, res) => {
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

    Inventory.countDocuments({ sede: sede, quantity: { $ne: 0 } }).then(count => {
        return res.status(200).json({
            count
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while getting products counter"
        });
    });
}

const searchProductStockBySede = (req, res) => {
    let sede = req.query.sede;
    let productName = req.query.productName;
    let page = Number(req.query.page);
    let skipvalue = page == 0 ? 0 : page * 10;

    Inventory.find({ sede: sede }).populate({ path: 'product', match: { fullName: { $regex: productName, $options: 'i' } } }).then(inventories => {
        inventories = inventories.filter(inventory => inventory.product);
        if (!inventories) {
            return res.status(404).json({
                "message": "No inventories avaliable..."
            });
        }

        const paginatedInventories = inventories.slice(skipvalue, skipvalue + 10);

        return res.status(200).json({
            "inventories": paginatedInventories
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding inventories"
        });
    });
}

const getCountBySedeAndProduct = (req, res) => {
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
            "count": inventories.length
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding inventories"
        });
    });
}

const searchProductAvailableBySede = (req, res) => {
    let sede = req.query.sede;
    let productName = req.query.productName;
    let page = Number(req.query.page);
    let skipvalue = page == 0 ? 0 : page * 10;

    Inventory.find({ sede: sede, quantity: { $ne: 0 } }).populate({ path: 'product', match: { fullName: { $regex: productName, $options: 'i' } } }).then(inventories => {
        inventories = inventories.filter(inventory => inventory.product);
        if (!inventories) {
            return res.status(404).json({
                "message": "No inventories avaliable..."
            });
        }

        const paginatedInventories = inventories.slice(skipvalue, skipvalue + 10);

        return res.status(200).json({
            "inventories": paginatedInventories
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding inventories"
        });
    });
}

const getCountBySedeAndProductAndAvailable = (req, res) => {
    let sede = req.query.sede;
    let productName = req.query.productName;

    Inventory.find({ sede: sede, quantity: { $ne: 0 } }).populate({ path: 'product', match: { fullName: { $regex: productName, $options: 'i' } } }).then(inventories => {
        inventories = inventories.filter(inventory => inventory.product);
        if (!inventories) {
            return res.status(404).json({
                "message": "No inventories avaliable..."
            });
        }

        return res.status(200).json({
            "count": inventories.length
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding inventories"
        });
    });
}

const searchProductsStockByMySede = async (req, res) => {
    let userId = req.user.id;
    let productName = req.query.productName;
    let sede;
    let page = Number(req.query.page);
    let skipvalue = page == 0 ? 0 : page * 10;

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
        const paginatedInventories = inventories.slice(skipvalue, skipvalue + 10);

        return res.status(200).json({
            "inventories": paginatedInventories
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding inventories"
        });
    });
}

const getCountByMySedeAndProduct = async (req, res) => {
    let userId = req.user.id;
    let sede;
    let productName = req.query.productName;

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
            "count": inventories.length
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding inventories"
        });
    });
}

const searchProductsAvailableByMySede = async (req, res) => {
    let userId = req.user.id;
    let productName = req.query.productName;
    let sede;
    let page = Number(req.query.page);
    let skipvalue = page == 0 ? 0 : page * 10;

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
    
    Inventory.find({ sede: sede, quantity: { $ne: 0 } }).populate({ path: 'product', match: { fullName: { $regex: productName, $options: 'i' } } }).then(inventories => {
        inventories = inventories.filter(inventory => inventory.product);
        if (!inventories) {
            return res.status(404).json({
                "message": "No inventories avaliable..."
            });
        }

        const paginatedInventories = inventories.slice(skipvalue, skipvalue + 10);

        return res.status(200).json({
            "inventories": paginatedInventories
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding inventories"
        });
    });
}

const getCountByMySedeAndProductAndAvailable = async (req, res) => {
    let userId = req.user.id;
    let sede;
    let productName = req.query.productName;

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

    Inventory.find({ sede: sede, quantity: { $ne: 0 } }).populate({ path: 'product', match: { fullName: { $regex: productName, $options: 'i' } } }).then(inventories => {
        inventories = inventories.filter(inventory => inventory.product);
        if (!inventories) {
            return res.status(404).json({
                "message": "No inventories avaliable..."
            });
        }

        return res.status(200).json({
            "count": inventories.length
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding inventories"
        });
    });
}

const getByProductIdAndSede = (req, res) => {
    let sede = req.query.sede;
    let productId = req.query.productId;

    Inventory.findOne({ sede: sede, product: productId }).then(inventory => {
        if (!inventory) {
            return res.status(404).json({
                "message": "No inventory avaliable..."
            });
        }

        return res.status(200).json({
            "inventory": inventory
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding inventory"
        });
    });
}

const deleteBySedeAndProductId = async (req, res) => {
    let sede = req.query.sede;
    let productId = req.query.productId;

    Inventory.findOneAndDelete({ sede: sede, product: productId }).then(inventoryDeleted => {
        if (!inventoryDeleted) {
            return res.status(404).json({
                "message": "No inventory found"
            });
        }
        return res.status(200).json({
            "message": "Inventory deleted successfully"
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while deleting inventory"
        });
    });
}

module.exports = {
    create,
    getBySede,
    getCountBySede,
    update,
    getByMySede,
    getCountByMySede,
    getAvailableBySede,
    getCountBySedeAndAvailable,
    getAvailableByMySede,
    getCountByMySedeAndAvailable,
    searchProductStockBySede,
    getCountBySedeAndProduct,
    searchProductAvailableBySede,
    getCountBySedeAndProductAndAvailable,
    searchProductsStockByMySede,
    getCountByMySedeAndProduct,
    searchProductsAvailableByMySede,
    getCountByMySedeAndProductAndAvailable,
    getByProductIdAndSede,
    deleteBySedeAndProductId
}