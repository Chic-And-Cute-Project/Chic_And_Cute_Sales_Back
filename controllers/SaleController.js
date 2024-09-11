const Sale = require("../models/SaleModel");

const create = async (req, res) => {
    let saleBody = req.body;
    let userId = req.user.id;

    if (!saleBody.name || !saleBody.quantity) {
        return res.status(400).json({
            "message": "Faltan datos"
        });
    }

    let saleData = {
        sede: saleBody.sede,
        user: userId,
        paymentMethod: saleBody.paymentMethod,
        detail: saleBody.detail
    }

    let sale_to_save = new Sale(saleData);

    try {
        const saleStored = await sale_to_save.save();

        if (!saleStored) {
            return res.status(500).json({
                "message": "No sale saved"
            });
        }

        return res.status(200).json({
            "sale": saleStored
        });
    } catch (error) {
        return res.status(500).json({
            "message": "Error while saving sale"
        });
    }
}

const list = (_req, res) => {
    Sale.find().then(sales => {
        if (!sales) {
            return res.status(404).json({
                "message": "No sales avaliable..."
            });
        }

        return res.status(200).json({
            sales
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding sales"
        });
    });
}

module.exports = {
    create,
    list
}