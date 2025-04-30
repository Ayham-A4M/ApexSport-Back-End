const { default: mongoose } = require("mongoose");

const orderSchema=new mongoose.Schema({
    Address:String, //from client
    UserId:String, // client jwt decode
    TotalPrice:String, // in server
    Tax:String, //in server
    Products:Array, // array each product has product id amount of this product
    Status:String, 
    Date:String
});
const orderModel=mongoose.model('order',orderSchema,'orders');
module.exports=orderModel