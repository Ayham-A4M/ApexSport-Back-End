const { validationResult } = require('express-validator');
const productModel = require('../../models/productModel')
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;

const EditProduct = (data) => {
    const information = JSON.parse(data);
    const product = {
        ProductName: information.productName,
        Catagory: information.catagory,
        Brand: information.brand,
        Price: `${information.price}$`,
        Description: information.description,
        MinInCart: information.minInCart,
        Weight: information.weight,
        InStock: information.inStock,
        Custome:information.custome,
        DiscountPercentage: information.discountPercentage,
        PriceAfterDiscount: `${parseFloat(information.price) - (parseFloat(information.price) * parseFloat(information.discountPercentage) / 100)}$`,
    };

    return product;
}

const editProduct = async (req, res) => {

    const productId = req.body.productId;


   

    const edit_product = EditProduct(req.body.productData); // all information about product
    // check if there any new files uploaded ??
    // if (req.files.length > 0) {
    //     const imagesNames = [];
    //     req.files.forEach((file) => {
    //         imagesNames.push(file.filename)
    //     })
    //     edit_product.Images = imagesNames;
    // }
    edit_product.Images = req.body.images || [];
    //  call with data base to editing the product 
    try {
        const response = await productModel.findByIdAndUpdate(new objectId(productId), edit_product).exec();
        if (response)
            return res.status(200).send({ msg: 'product has been edited succesfuly' });
    } catch (err) {
        return res.status(500).send({ msg: 'server error' });
    }


}




module.exports = editProduct;