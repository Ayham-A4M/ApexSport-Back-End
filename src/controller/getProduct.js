const productModel = require('../models/productModel');
const getProduct = async (req, res) => {
    const page = req.query.page || 0; //number of page index 0 => first page
    const limit = 16; // limit products in single page 
    
    const Filters = (req.query.catagory && req.query.catagory != '' && req.query.catagory != 'all') ? { Catagory: req.query.catagory } : {};
    const productName = req.query.name;
    (productName && productName != "")?Filters.ProductName={ $regex: productName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), $options: "i" }:false
    // prepare the filter for return products by productName
    
    const skip = ((page - 1) * limit < 0 ? 0 : (page - 1) * limit) //how many documents will skip by the one page
    const numberOfProductsInDB = await productModel.countDocuments(Filters.Catagory?{Catagory:Filters.Catagory}:{});
    


    const responsepro = await productModel.find(Filters, { _id: true, ProductName: true, InStock: true, Images: { $slice: 1 }, DiscountPercentage: true, PriceAfterDiscount: true, Price: true }).skip(skip).limit(limit);
    return res.status(200).send({
        products: responsepro,
        page: page,
        pageLimit: limit,
        totalPages: ((numberOfProductsInDB % limit === 0) ? (numberOfProductsInDB / limit) : Math.floor((numberOfProductsInDB / limit)) + 1),
    });
}
module.exports = getProduct;