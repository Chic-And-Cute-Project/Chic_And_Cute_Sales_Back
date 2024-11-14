const CloseSalesDay = require("../models/CloseSalesDayModel");
const User = require("../models/UserModel");

const createFromSales = async (req, res) => {
    let closeSalesDayBody = req.body;
    let userId = req.user.id;
    let sede;

    if (!closeSalesDayBody.sales || !closeSalesDayBody.cashAmount || !closeSalesDayBody.cardAmount) {
        return res.status(400).json({
            "message": "Faltan datos"
        });
    }

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

    let closeSalesDayData = {
        sede: sede,
        user: userId,
        sales: closeSalesDayBody.sales,
        cashAmount: closeSalesDayBody.cashAmount,
        cardAmount: closeSalesDayBody.cardAmount
    }

    let close_sales_day_to_save = new CloseSalesDay(closeSalesDayData);

    try {
        const closeSalesDayStored = await close_sales_day_to_save.save();

        if (!closeSalesDayStored) {
            return res.status(500).json({
                "message": "No close sales day saved"
            });
        }

        return res.status(200).json({
            "closeSalesDay": closeSalesDayStored
        });
    } catch (error) {
        return res.status(500).json({
            "message": "Error while saving close sales day"
        });
    }
}

const createFromAdmin = async (req, res) => {
    let closeSalesDayBody = req.body;
    let userId = req.user.id;

    if (!closeSalesDayBody.sede || !closeSalesDayBody.sales) {
        return res.status(400).json({
            "message": "Faltan datos"
        });
    }

    let closeSalesDayData = {
        sede: closeSalesDayBody.sede,
        user: userId,
        sales: closeSalesDayBody.sales,
        cashAmount: closeSalesDayBody.cashAmount,
        cardAmount: closeSalesDayBody.cardAmount
    }

    let close_sales_day_to_save = new CloseSalesDay(closeSalesDayData);

    try {
        const closeSalesDayStored = await close_sales_day_to_save.save();

        if (!closeSalesDayStored) {
            return res.status(500).json({
                "message": "No close sales day saved"
            });
        }

        return res.status(200).json({
            "closeSalesDay": closeSalesDayStored
        });
    } catch (error) {
        return res.status(500).json({
            "message": "Error while saving close sales day"
        });
    }
}

const getByMySede = async (req, res) => {
    let userId = req.user.id;
    let sede;
    let minDate = new Date(req.query.minDate);
    let maxDate = new Date(req.query.maxDate);

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
    
    CloseSalesDay.find({ sede: sede }).populate([{path: 'user'}, {path: 'sales', populate: {path: 'detail', populate: 'product'}}]).then(closeSalesDays => {
        if (!closeSalesDays) {
            return res.status(404).json({
                "message": "No close sales days avaliable..."
            });
        }

        closeSalesDays = closeSalesDays.filter(closeDalesDay => {
            return closeDalesDay.date <= maxDate && closeDalesDay.date >= minDate
        });

        return res.status(200).json({
            closeSalesDays
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding closeSalesDay"
        });
    });
}

const getBySede = async (req, res) => {
    let sede = req.query.sede;
    let minDate = new Date(req.query.minDate);
    let maxDate = new Date(req.query.maxDate);

    CloseSalesDay.find({ sede: sede }).populate([{path: 'user'}, {path: 'sales', populate: {path: 'detail', populate: 'product'}}]).then(closeSalesDays => {
        if (!closeSalesDays) {
            return res.status(404).json({
                "message": "No close sales days avaliable..."
            });
        }

        closeSalesDays = closeSalesDays.filter(closeDalesDay => {
            return closeDalesDay.date <= maxDate && closeDalesDay.date >= minDate
        });

        return res.status(200).json({
            closeSalesDays
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding closeSalesDay"
        });
    });
}

module.exports = {
    createFromSales,
    createFromAdmin,
    getByMySede,
    getBySede
}