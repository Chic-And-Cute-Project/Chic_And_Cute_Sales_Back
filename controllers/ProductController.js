const Product = require("../models/ProductModel");

const create = async (req, res) => {
    let productBody = req.body;

    if (!productBody.code || !productBody.fullName || !productBody.price) {
        return res.status(400).json({
            "message": "Faltan datos"
        });
    }

    let productData = {
        code: productBody.code,
        fullName: productBody.fullName,
        price: productBody.price
    }

    try {
        const products = await Product.find({ $or: [{ code: productData.code }, { fullName: productData.fullName }] });

        if (products && products.length >= 1) {
            return res.status(400).json({
                "message": "Ya existe un producto con el mismo nombre o codigo"
            });
        }

        let product_to_save = new Product(productData);

        try {
            const productStored = await product_to_save.save();

            if (!productStored) {
                return res.status(500).json({
                    "message": "No product saved"
                });
            }

            return res.status(200).json({
                "product": productStored
            });
        } catch (error) {
            return res.status(500).json({
                "message": "Error while saving product"
            });
        }
    } catch {
        return res.status(500).json({
            "message": "Error while finding product duplicate"
        });
    }
}

const listByPage = (req, res) => {
    let page = Number(req.query.page);
    let skipvalue = page == 0 ? 0 : page * 10;

    Product.find().limit(10).skip(skipvalue).then(products => {
        if (products.length == 0) {
            return res.status(404).json({
                "status": "error",
                "message": "No existen productos"
            });
        }

        return res.status(200).json({
            products
        });
    }).catch(() => {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding products"
        });
    });
}

const getCount = (_req, res) => {
    Product.countDocuments().then(count => {
        return res.status(200).json({
            count
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while getting products counter"
        });
    });
}

module.exports = {
    create,
    listByPage,
    getCount
}