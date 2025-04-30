const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
    ProductName: String,
    Catagory: String,
    Brand: String,
    Price: String,
    Description: String,
    InStock: Number,
    Weight: Number,
    Custome:Array,
    DiscountPercentage: String,
    MinInCart: Number,
    CreatedAt: String,
    PriceAfterDiscount: String,
    NumberOfOrder: Number,
    Images: Array
});
productSchema.index({ Catagory: 1 });
productSchema.index({ NumberOfOrder: 1 });
const productModel = mongoose.model('product', productSchema, 'products');
module.exports = productModel;