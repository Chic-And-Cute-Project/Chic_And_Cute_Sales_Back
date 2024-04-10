const Discount = require("../models/DiscountModel");

const create = async (req, res) => {
    let discountBody = req.body;

    if (!discountBody.name || !discountBody.quantity) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    let discountData = {
        name: discountBody.name,
        quantity: discountBody.quantity
    }

    try {
        const discounts = await Discount.find({ name: discountData.name, quantity: discountData.quantity });

        if (discounts && discounts.length >= 1) {
            return res.status(400).json({
                "status": "success",
                "message": "Ya existe un descuento con el mismo nombre y cantidad"
            });
        }

        let discount_to_save = new Discount(discountData);

        try {
            const discountStored = await discount_to_save.save();

            if (!discountStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No discount saved"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Descuento creado",
                "discount": discountStored
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving discount",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding discount duplicate"
        });
    }
}

const list = (_req, res) => {
    Discount.find().then(discounts => {
        if (!discounts) {
            return res.status(404).json({
                status: "Error",
                message: "No discounts avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            discounts
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
    list
}