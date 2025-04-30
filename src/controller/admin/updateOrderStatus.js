const orderModel=require('../../models/orderModel');
const updateOrderStatus=async(req,res)=>{
    const orderId=req.body.orderId;
    const newValue=req.body.status;
    try{
        if(!orderId || !newValue)
            throw new Error('Unexpected value')
        const response=await orderModel.findByIdAndUpdate(orderId,{Status:newValue}).lean().exec();
        
        return res.status(200).send({msg:'operation complete'});

    }catch(err){
        return res.status(500).send({msg:'server error'})
    }
}
module.exports=updateOrderStatus