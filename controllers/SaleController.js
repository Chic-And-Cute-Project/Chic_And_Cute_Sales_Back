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
    let sede;
    let salesReport = [];

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
            sale.detail.forEach(detail => {
                const saleReport = salesReport.find(saleReport => saleReport.product._id == detail.product._id);
                if (!saleReport) {
                    salesReport.push({ product: detail.product, quantity: detail.quantity});
                } else {
                    saleReport.quantity = saleReport.quantity + detail.quantity;
                }
            });
        });

        return res.status(200).json({
            salesReport
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding sales"
        });
    });
}

module.exports = {
    create,
    myInfo
}