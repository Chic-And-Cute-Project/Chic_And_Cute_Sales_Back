const Product = require("../models/ProductModel");

const create = async (req, res) => {
    let productBody = req.body;

    if (!productBody.code || !productBody.fullName || !productBody.price) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    let productData = {
        code: productBody.code,
        fullName: productBody.fullName,
        price: productBody.price
    }

    try {
        const products = await Product.find({ code: productData.code, fullname: productData.fullName });

        if (products && products.length >= 1) {
            return res.status(400).json({
                "status": "success",
                "message": "Ya existe un producto con el mismo nombre y codigo"
            });
        }

        let product_to_save = new Product(productData);

        try {
            const productStored = await product_to_save.save();

            if (!productStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No product saved"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Producto creado",
                "product": productStored
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving product",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding product duplicate"
        });
    }
}

const list = (_req, res) => {
    Product.find().then(products => {
        if (!products) {
            return res.status(404).json({
                status: "Error",
                message: "No prouducts avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            products
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