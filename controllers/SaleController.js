const Sale = require("../models/SaleModel");
const User = require("../models/UserModel");

const create = async (req, res) => {
    let saleBody = req.body;
    let userId = req.user.id;

    if (!saleBody.sede || !saleBody.paymentMethod || !saleBody.detail) {
        return res.status(400).json({
            "message": "Faltan datos"
        });
    }

    let saleData;

    if (!saleBody.date) {
        saleData = {
            sede: saleBody.sede,
            user: userId,
            paymentMethod: saleBody.paymentMethod,
            detail: saleBody.detail
        }
    } else {
        saleData = {
            sede: saleBody.sede,
            user: userId,
            paymentMethod: saleBody.paymentMethod,
            detail: saleBody.detail,
            date: saleBody.date
        }
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

const myInfo = async (req, res) => {
    let userId = req.user.id;
    let minDate = new Date(req.query.minDate);
    let maxDate = new Date(req.query.maxDate);
    let sede;
    let saleDetailsMap = {};
    let cash = 0;
    let card = 0;

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
    
    Sale.find({ sede: sede, user: userId, date: {
        $gte: minDate,
        $lte: maxDate
    }}).populate({ path: 'detail', populate: 'product' }).then(sales => {
        if (!sales) {
            return res.status(404).json({
                "message": "No sales avaliable..."
            });
        }

        sales.forEach(sale => {
            sale.detail.forEach(detail => {
                const { _id, price } = detail.product;
                const quantity = detail.quantity;
                const finalPrice = (quantity * price) * (1 - detail.discount / 100);

                if (!saleDetailsMap[_id]) {
                    saleDetailsMap[_id] = {
                        product: detail.product,
                        quantity,
                        finalPrice
                    };
                } else {
                    saleDetailsMap[_id].quantity += quantity;
                    saleDetailsMap[_id].finalPrice += finalPrice;
                }
            });
            sale.paymentMethod.forEach(payment => {
                if (payment.type == "Efectivo") {
                    cash += payment.amount;
                } else {
                    card += payment.amount;
                }
            });
        });

        const saleDetails = Object.values(saleDetailsMap).map(detail => ({
            ...detail
        }));

        return res.status(200).json({
            saleDetails,
            "salesCount": sales.length,
            cash,
            card
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding sales"
        });
    });
}

const infoAdmin = async (req, res) => {
    let userId = req.query.userId;
    let minDate = new Date(req.query.minDate);
    let maxDate = new Date(req.query.maxDate);
    let sede = req.query.sede;
    let saleDetailsMap = {};
    let cash = 0;
    let card = 0;

    Sale.find({ sede: sede, user: userId, date: {
        $gte: minDate,
        $lte: maxDate
    }}).populate({ path: 'detail', populate: 'product' }).then(sales => {
        if (!sales) {
            return res.status(404).json({
                "message": "No sales avaliable..."
            });
        }

        sales.forEach(sale => {
            sale.detail.forEach(detail => {
                const { _id, price } = detail.product;
                const quantity = detail.quantity;
                const finalPrice = (quantity * price) * (1 - detail.discount / 100);

                if (!saleDetailsMap[_id]) {
                    saleDetailsMap[_id] = {
                        product: detail.product,
                        quantity,
                        finalPrice
                    };
                } else {
                    saleDetailsMap[_id].quantity += quantity;
                    saleDetailsMap[_id].finalPrice += finalPrice;
                }
            });
            sale.paymentMethod.forEach(payment => {
                if (payment.type == "Efectivo") {
                    cash += payment.amount;
                } else {
                    card += payment.amount;
                }
            });
        });

        const saleDetails = Object.values(saleDetailsMap).map(detail => ({
            ...detail
        }));

        return res.status(200).json({
            saleDetails,
            "salesCount": sales.length,
            cash,
            card
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding sales"
        });
    });
}

const getSalesByDate = async (req, res) => {
    let userId = req.user.id;
    let sede;
    let minDate = new Date(req.query.date);
    let maxDate = new Date(req.query.date);
    maxDate.setDate(minDate.getDate() + 1);
    let cash = 0;
    let card = 0;

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
    
    Sale.find({ sede: sede, date: {
        $gte: minDate,
        $lte: maxDate
    }}).populate({ path: 'detail', populate: 'product' }).then(sales => {
        if (!sales) {
            return res.status(404).json({
                "message": "No sales avaliable..."
            });
        }

        sales.forEach(sale => {
            sale.paymentMethod.forEach(payment => {
                if (payment.type == "Efectivo") {
                    cash += payment.amount;
                } else {
                    card += payment.amount;
                }
            });
        });

        return res.status(200).json({
            sales,
            cash,
            card
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding sales"
        });
    });
}

const getSalesByDateAndSede = async (req, res) => {
    let sede = req.query.sede;
    let minDate = new Date(req.query.date);
    let maxDate = new Date(req.query.date);
    maxDate.setDate(minDate.getDate() + 1);
    let cash = 0;
    let cashCounter = 0;
    let card = 0;
    let cardCounter = 0;

    Sale.find({ sede: sede, date: {
        $gte: minDate,
        $lte: maxDate
    }}).populate({ path: 'detail', populate: 'product' }).then(sales => {
        if (!sales) {
            return res.status(404).json({
                "message": "No sales avaliable..."
            });
        }

        sales.forEach(sale => {
            sale.paymentMethod.forEach(payment => {
                if (payment.type == "Efectivo") {
                    cash += payment.amount;
                    cashCounter++;
                } else {
                    card += payment.amount;
                    cardCounter++;
                }
            });
        });

        return res.status(200).json({
            sales,
            cash,
            cashCounter,
            card,
            cardCounter
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding sales"
        });
    });
}

module.exports = {
    create,
    myInfo,
    infoAdmin,
    getSalesByDate,
    getSalesByDateAndSede
}