const { validationResult } = require('express-validator');
const productModel = require('../models/productModel');

const newProduct = (data) => {
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
    DiscountPercentage:information.discountPercentage,
    NumberOfOrder:0,
    PriceAfterDiscount:`${parseFloat(information.price)-(parseFloat(information.price)*parseFloat(information.discountPercentage)/100)}$`,
    CreatedAt: information.createdAt
  };

  return product;
}

const creatNewProduct = (req, res) => {


  const resultValidation = validationResult(req);
  if (!resultValidation.isEmpty()) {
    return res.status(400).send({ msg: resultValidation.errors[0].msg });
  } else {
    //create the new product 
    const new_product = newProduct(req.body.productData);
    // const imagesNames = [];
    // req.files.forEach((file) => {
    //   imagesNames.push(file.filename)
    // })
    // new_product.Images = imagesNames;
    new_product.Images = req.body.images || [];
    // call with db and save the new product in db 
    const productSave = new productModel(new_product);
    productSave.save().then(() => {
      return res.status(200).send({ msg: 'Product has saved correctly' })

    }).catch((err) => { return res.status(400).send(err) })
  }
}




module.exports = creatNewProduct;


