const productModel=require('../../models/productModel')
const mongoose=require('mongoose');
const objectId=mongoose.Types.ObjectId
const deleteProduct=async (req,res)=>{
    try{
        const productId=req.body.productId;
        if(!productId){return res.status(500).send({msg:'invalid id'})}
        const response=await productModel.findByIdAndDelete(new objectId(productId));
        if(!response)
            return res.status(404).send({msg:'product not found'})
        return res.status(200).send({msg:'operation complete'})
    }catch(err){
        return res.status(500).send({msg:'unexpected error'})
    }

    
}
module.exports=deleteProduct