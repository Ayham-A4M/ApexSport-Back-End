const { default: mongoose } = require("mongoose");


const userSchema=new mongoose.Schema({
    FirstName:String,
    LastName:String,
    Email:String,
    UserName:String,
    Role:String,
    password:String,
    Cart:Array,
    WishList:Array,
    TokenVersion:{type:Number,default:0}

});
const userModel=mongoose.model('user',userSchema,'users');
module.exports=userModel;
