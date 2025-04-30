const userModel = require('../../../models/UserModal')
const { ObjectId } = require('mongoose').Types;
const getWishList = async (req, res) => {

    const userId = new ObjectId(res.locals.id);
    const response = await userModel.aggregate([
        { $match: { _id: userId } },
        { $unwind: "$WishList" },
        { $addFields: { "WishList": { $toObjectId: "$WishList" } } },
        {
            $lookup: {
                from: "products",
                localField: "WishList",
                foreignField: "_id",
                as: "product"
            }
        }, { $unwind: "$product" },

        {
            $project: {
                _id: 0, // Exclude the user _id if not needed
                productId: "$product._id", // Include the product id from the Cart
                productName: "$product.ProductName", // Include the product name from the `ProductsInCart`
                productPrice: "$product.Price", // Include the product price
                inStock: "$product.InStock",
                discount: "$product.DiscountPercentage",
                priceAfterDiscount: "$product.PriceAfterDiscount",
                image: { $arrayElemAt: ["$product.Images", 0] }
            }
        }

    ])
    if (response) { return res.status(200).send(response) }
    return res.status(404).send({ msg: "faild to catch the products" })

}
module.exports = getWishList