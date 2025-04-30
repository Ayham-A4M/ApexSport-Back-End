
const productModel=require('../models/productModel')
const getProductByID=(req,res)=>{
   const id=req.query.id;
   try{
    if(!id){throw 'No id found'}
    productModel.findById(id).then((response)=>{
        if(response){return res.status(200).send(response)}
        else{throw res;}
    }).catch((err)=>{
        return res.status(404).send({msg:'No Product with this id '})
    })
   }catch(errorMessage){
    return res.status(404).send({msg:errorMessage})
   }
}
module.exports=getProductByID;