const orderModel=require('../../models/orderModel')

const getOrdersStatus=async (req,res)=>{
    try{
        const completedOrders=await orderModel.countDocuments({Status:'completed'})
        const shippingOrders=await orderModel.countDocuments({Status:'shipping'})
        const processingOrders=await orderModel.countDocuments({Status:'processing'})
        const pendingOrders=await orderModel.countDocuments({Status:'pending'})
        return res.status(200).send({completedOrders,shippingOrders,processingOrders,pendingOrders});
    }catch(err){
        return res.status(500).send({msg:'server error'})
    }
   
}
module.exports=getOrdersStatus