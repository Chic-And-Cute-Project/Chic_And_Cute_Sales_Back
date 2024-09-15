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

const myInfo = async (req, res) => {
    let userId = req.user.id;
    let minDate = req.query.minDate;
    let maxDate = req.query.maxDate;
    let sede;
    let saleDetails = [];
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
    
    Sale.find({ sede: sede, user: userId }).populate({ path: 'detail', populate: 'product' }).then(sales => {
        if (!sales) {
            return res.status(404).json({
                "message": "No sales avaliable..."
            });
        }

        sales.forEach(sale => {
            if (sale.date <= new Date(maxDate) && sale.date >= new Date(minDate)) {
                sale.detail.forEach(detail => {
                    const saleReport = saleDetails.find(saleReport => saleReport.product._id == detail.product._id);
                    if (!saleReport) {
                        let price = detail.quantity * detail.product.price;
                        price = price - price * detail.discount * 0.01;
    
                        saleDetails.push({ product: detail.product, quantity: detail.quantity, finalPrice: price});
                    } else {
                        let price = detail.quantity * detail.product.price;
                        price = price - price * detail.discount * 0.01;
    
                        let roundedFinalPrice = saleReport.finalPrice + price;
    
                        saleReport.finalPrice = roundedFinalPrice.toFixed(2);
    
                        saleReport.quantity = saleReport.quantity + detail.quantity;
                    }
                });
                sale.paymentMethod.forEach(payment => {
                    if (payment.type == "Efectivo") {
                        cash = cash + payment.amount;
                    } else {
                        card = card + payment.amount;
                    }
                });
            }
        });

        return res.status(200).json({
            saleDetails,
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
    let minDate = req.query.minDate;
    let maxDate = req.query.maxDate;
    let sede = req.query.sede;
    let saleDetails = [];
    let cash = 0;
    let card = 0;

    Sale.find({ sede: sede, user: userId }).populate({ path: 'detail', populate: 'product' }).then(sales => {
        if (!sales) {
            return res.status(404).json({
                "message": "No sales avaliable..."
            });
        }
        
        sales.forEach(sale => {
            if (sale.date <= new Date(maxDate) && sale.date >= new Date(minDate)) {
                sale.detail.forEach(detail => {
                    const saleReport = saleDetails.find(saleReport => saleReport.product._id == detail.product._id);
                    if (!saleReport) {
                        let price = detail.quantity * detail.product.price;
                        price = price - price * detail.discount * 0.01;
    
                        saleDetails.push({ product: detail.product, quantity: detail.quantity, finalPrice: price});
                    } else {
                        let price = detail.quantity * detail.product.price;
                        price = price - price * detail.discount * 0.01;
    
                        let roundedFinalPrice = saleReport.finalPrice + price;
    
                        saleReport.finalPrice = roundedFinalPrice.toFixed(2);
    
                        saleReport.quantity = saleReport.quantity + detail.quantity;
                    }
                });
                sale.paymentMethod.forEach(payment => {
                    if (payment.type == "Efectivo") {
                        cash = cash + payment.amount;
                    } else {
                        card = card + payment.amount;
                    }
                });
            }
        });

        return res.status(200).json({
            saleDetails,
            cash,
            card
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
    infoAdmin
}