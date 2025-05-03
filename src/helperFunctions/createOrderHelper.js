const userModel = require('../models/UserModal')

// const calculateTotalPrice = (productsInformationFromCart) => {
//     let TotalPrice = productsInformationFromCart.reduce((acc, currentvalue) => {
//         acc += (currentvalue.quantity * parseFloat(currentvalue.priceAfterDiscount));
//         return acc
//     }, 0)
//     return TotalPrice + TotalPrice * 0.05
// }


const getOrderProducts = (productsInformationFromCart) => {
    const orderProducts = productsInformationFromCart.reduce((acc, currentvalue) => {
        acc.push({ productId: currentvalue.productId, quantity: currentvalue.quantity })
        return acc;
    }, [])
    return orderProducts
}
const getProductsInformationsFromCart = async (userId) => {
    const ProductsInformationFromCart = await userModel.aggregate([
        {
            // Stage 1: Match the user by id
            $match: {
                _id: userId
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
                as: "Product" // Alias for the resulting product details
            }
        },
        {
            $addFields: {
                "Cart.productIdString": { $toString: "$Cart.productId" }
            }
        },
        {
            // Stage 4: Unwind the `ProductsInCart` array (this will give us the product details for each cart item)
            $unwind: "$Product"
        },
        {
            // Stage 5: Project the final output with the necessary fields (e.g., product details and quantity)
            $project: {
                _id: 0, // Exclude the user _id if not needed
                productName:"$Product.ProductName",
                productId: "$Cart.productIdString", // Include the product id from the Cart
                quantity: "$Cart.quantity",  // quantity of product inside the user cart
                priceAfterDiscount: "$Product.PriceAfterDiscount", // price after discount if there is discount  or original price if there is no discount
                customes:"$Cart.customes",
                inStock: "$Product.InStock" // number of product inside stock 
            }
        }
    ])
    return ProductsInformationFromCart
}

const checkIfProductOutOfStock = (productsInformationFromCart) => {
    const outOfStockProducts = productsInformationFromCart.filter(
        (product) => product.inStock - product.quantity < 0
    );
    return outOfStockProducts.length > 0 ? true : false
}


module.exports = {
    calculateTotalPrice, getOrderProducts, getProductsInformationsFromCart, checkIfProductOutOfStock
}

