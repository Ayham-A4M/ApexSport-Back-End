const productModel = require('../models/productModel');
async function getProductsByName(req, res) {
    const name = req.query.name;
    const response = await productModel.find({ ProductName: { $regex: name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), $options: "i" } });
    return res.status(200).send({ products: response })
}
module.exports = getProductsByName

