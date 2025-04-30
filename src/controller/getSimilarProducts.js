const productModel=require('../models/productModel');
const getSimilarProducts=async (req,res)=>{
    const catagory=req.params.catagory;
    if(!catagory){return res.status(400).send({msg:'no matching catagory'})}
    const products=await productModel.find({Catagory:catagory},{_id:true,ProductName:true,InStock:true,Images:{$slice:1},DiscountPercentage:true,PriceAfterDiscount:true,Price:true}).sort({NumberOfOrder:-1}).lean().limit(7);
    if(products){
       return  res.status(200).send(products);
    }
    return res.status(404).send({msg:'There are no products similar'});
  
}
module.exports=getSimilarProducts