const orderModel = require('../../models/orderModel');
const getOrders = async (req, res) => {
    const page = req.query.page || 0; //number of page index 0 => first page
    const limit = 20; // limit products in single page 
    const skip = ((page - 1) * limit < 0 ? 0 : (page - 1) * limit) //how many documents will skip by the one page
    const searchByUserName = req.query.userName;
    const numberOfProductsInDB = await orderModel.countDocuments({});


    try {
        const response = await orderModel.aggregate([
            { $unwind: "$Products" },
            {
                $addFields: {
                    "Products.productId": { $toObjectId: "$Products.productId" }
                }

            },
            {
                $addFields: {
                    "UserID": { $toObjectId: "$UserId" }
                }

            },
            {
                $lookup: {
                    from: "products", // The products collection
                    localField: "Products.productId", // The productId field from the `Cart` array
                    foreignField: "_id", // The _id field in the `products` collection
                    as: "ProductOrder" // Alias for the resulting product details
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "UserID",
                    foreignField: "_id",
                    as: "User"
                },
            },
            {
                $unwind: "$User"
            },
            {
                $match: {
                    "User.UserName": {
                        $regex: searchByUserName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
                        $options: "i" // Case-insensitive
                    }
                }
            },
            {
                $unwind: "$ProductOrder"
            },
            {
                $project: {
                    UserName: "$User.UserName",
                    TotalPrice: true,
                    Address: true,
                    Tax: true,
                    Quantity: "$Products.quantity",
                    Custome: "$Products.custome",
                    Status: true,
                    _id: true,
                    ProductName: "$ProductOrder.ProductName",
                    PriceAfterDiscount: "$ProductOrder.PriceAfterDiscount",
                    Date: true,
                    Image: { $arrayElemAt: ["$ProductOrder.Images", 0] }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    Address: { $first: "$Address" },
                    UserName: { $first: "$UserName" },

                    TotalPrice: { $first: "$TotalPrice" },
                    Tax: { $first: "$Tax" },
                    Date: { $first: "$Date" },
                    Status: { $first: "$Status" },
                    ProductsInfo: {
                        $push: {
                            Quantity: "$Quantity",
                            ProductName: "$ProductName",
                            Image: "$Image",
                            PriceAfterDiscount: "$PriceAfterDiscount",
                            Custome: "$Custome",
                        }
                    }
                }
            }, {
                $sort: { Date: -1 }
            }
        ]).skip(skip).limit(limit).exec();
    

        return res.status(200).send({
            orders: response,
            totalPages: ((numberOfProductsInDB % limit === 0) ? (numberOfProductsInDB / limit) : Math.floor((numberOfProductsInDB / limit)) + 1),
        });



    } catch (err) {
        return res.status(500).send({ msg: 'server error' });
    }
}

module.exports = getOrders