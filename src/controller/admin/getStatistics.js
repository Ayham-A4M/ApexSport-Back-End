const userModel = require('../../models/UserModal')
const productModel = require('../../models/productModel')
const orderModel = require('../../models/orderModel')
const getStatistics = async (req, res) => {
    try {
        const numberOfUsers = await userModel.countDocuments({ Role: "user" }).exec();
        const numberOfProducts = await productModel.countDocuments().exec();
        const totalOrders = await orderModel.countDocuments().exec();
        const pricesOfOrders = await orderModel.find({},{_id:false,TotalPrice:true}).select('TotalPrice').lean();
        const TotalSeals=pricesOfOrders.reduce((acc,current)=>{
          acc+=parseFloat(current.TotalPrice)
          return acc;
        },0)
        
        return res.status(200).send({ numberOfProducts, numberOfUsers, totalOrders, TotalSeals:`${TotalSeals}$` })

    } catch (err) {
      
        return res.status(500).send({ msg: 'server error' })
        
    }

}
module.exports = getStatistics