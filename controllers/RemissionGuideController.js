const RemissionGuide = require("../models/RemissionGuideModel");

const create = async (req, res) => {
    let remissionGuideBody = req.body;

    if (!remissionGuideBody.date || !remissionGuideBody.sedeFrom || !remissionGuideBody.sedeFrom) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    let remissionGuideData = {
        date: remissionGuideBody.date,
        sedeFrom: remissionGuideBody.sedeFrom,
        sedeTo: remissionGuideBody.sedeTo,
        products: remissionGuideBody.products
    }

    let remission_guide_to_save = new RemissionGuide(remissionGuideData);

    try {
        const remissionGuideStored = await remission_guide_to_save.save();

        if (!remissionGuideStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No product saved"
            });
        }

        return res.status(200).json({
            "status": "success",
            "message": "Guia de remision creada",
            "remissionGuide": remissionGuideStored
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving remission guide",
            error
        });
    }
}

module.exports = {
    create
}