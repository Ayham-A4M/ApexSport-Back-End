const userModel=require('../../../models/UserModal')
const { ObjectId } = require('mongoose').Types;
const getProductsCart=async(req,res)=>{
    
        const id = new ObjectId(res.locals.id);
    
        const Products = await userModel.aggregate([
            {
                // Stage 1: Match the user by id
                $match: {
                    _id: id
                }
            },
            {
                // Stage 2: Unwind the `Cart` array to get individual cart items
                $unwind: "$Cart"
            },
            {
                $addFields: {
                    "Cart.productId": { $toObjectId: "$Cart.productId" }
                }
            },
            {
                // Stage 3: Lookup the product details from the `products` collection based on the `productId` in the `Cart`
                $lookup: {
                    from: "products", // The products collection
                    localField: "Cart.productId", // The productId field from the `Cart` array
                    foreignField: "_id", // The _id field in the `products` collection
                    as: "ProductsInCart" // Alias for the resulting product details
                }
            },
            {
                $addFields: {
                    "Cart.productIdString": { $toString: "$Cart.productId" }
                }
            },
            {
                // Stage 4: Unwind the `ProductsInCart` array (this will give us the product details for each cart item)
                $unwind: "$ProductsInCart"
            },
            {
                // Stage 5: Project the final output with the necessary fields (e.g., product details and quantity)
                $project: {
                    _id: 0, // Exclude the user _id if not needed
                    productId: "$Cart.productIdString", // Include the product id from the Cart
                    productName: "$ProductsInCart.ProductName", // Include the product name from the `ProductsInCart`
                    productPrice: "$ProductsInCart.Price", // Include the product price
                    quantity: "$Cart.quantity",
                    customes:"$Cart.customes",
                    discount: "$ProductsInCart.DiscountPercentage",
                    priceAfterDiscount: "$ProductsInCart.PriceAfterDiscount",
                    image: { $arrayElemAt: ["$ProductsInCart.Images", 0] }
                }
            }
        ])
    
        if (Products) {
            return res.status(200).send(Products);
        } else {
            return res.status(500).send({ msg: "server error" });
        }
    }

module.exports=getProductsCart