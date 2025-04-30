const orderModal = require('../models/orderModel');

const getUserOrder = async (req, res) => {
    const id = res.locals.id;
    const order=parseInt(((req.query.order==1 ||req.query.order==-1)?req.query.order: -1))
    try {
        const Ordersresponse = await orderModal.aggregate([
            { $match: { UserId: id } },
            { $unwind: "$Products" },
            {
                $addFields: {
                    "Products.productId": { $toObjectId: "$Products.productId" }
                }
            },
            {
                $lookup: {
                    from: "products", // The products collection
                    localField: "Products.productId", // The productId field from the `Cart` array
                    foreignField: "_id", // The _id field in the `products` collection
                    as: "ProductOrder" // Alias for the resulting product details
                }
            },
            {
                $unwind: "$ProductOrder"
            },
            {
                $project: {
                    TotalPrice: true,
                    Tax: true,
                    Quantity: "$Products.quantity",
                    Status: true,
                    _id: true,
                    ProductName: "$ProductOrder.ProductName",
                    PriceAfterDiscount: "$ProductOrder.PriceAfterDiscount",
                    Date:true,
                    Image: { $arrayElemAt: ["$ProductOrder.Images", 0] }
                }
            }, {
                $group: {
                    _id: "$_id",
                    TotalPrice: { $first: "$TotalPrice" },
                    Tax:{$first:"$Tax"},
                    Date:{$first:"$Date"},
                    Status:{$first:"$Status"},
                    ProductsInfo:{$push:{
                        Quantity:"$Quantity",
                        ProductName:"$ProductName",
                        Image:"$Image",
                        PriceAfterDiscount:"$PriceAfterDiscount"

                    }}
                }
            },{
                $sort:{Date:order}
            }
        ])
        if (Ordersresponse) {
            
            return res.status(200).send(Ordersresponse)
        }else{
            throw 'no order yet'
        }

    } catch (err) {
        return res.status(500).send({ msg: err });
    }
}
module.exports = getUserOrder

