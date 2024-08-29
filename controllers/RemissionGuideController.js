const RemissionGuide = require("../models/RemissionGuideModel");
const User = require("../models/UserModel");

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

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

const list = (_req, res) => {
    RemissionGuide.find().populate({ path: 'products', populate: 'product' }).then(remissionGuides => {
        if (!remissionGuides) {
            return res.status(404).json({
                status: "Error",
                message: "No remission guides avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            remissionGuides
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const update = (req, res) => {
    let id = req.query.idRemissionGuide;

    RemissionGuide.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(remissionGuideUpdated => {
        if (!remissionGuideUpdated) {
            return res.status(404).json({
                status: "error",
                mensaje: "Remission guide not found"
            });
        }
        return res.status(200).send({
            status: "success",
            remissionGuide: remissionGuideUpdated
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

    RemissionGuide.find({ sedeTo: sede }).populate({ path: 'products', populate: 'product' }).then(remissionGuides => {
        if (!remissionGuides) {
            return res.status(404).json({
                status: "Error",
                message: "No remission guides avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            remissionGuides
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
    update,
    getByMySede
}