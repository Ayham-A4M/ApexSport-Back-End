const { ObjectId } = require('mongoose').Types;
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_API_KEY)
const { calculateTotalPrice, getProductsInformationsFromCart, checkIfProductOutOfStock } = require('../helperFunctions/createOrderHelper')

const createOrder = async (req, res) => {
    const userId = new ObjectId(res.locals.id)
    const address = req.body.address;
    const productInformationFromCart = await getProductsInformationsFromCart(userId); // we get information about each product but not the oreder products to save
    try {
        const checkProductOutOfStock = checkIfProductOutOfStock(productInformationFromCart)
        if (checkProductOutOfStock) { // if there any product out of stock we cancle the progress 
            return res.status(400).send({ msg: 'Some products out of stock' })
        }
        // start progress to preaper the  order
        const TotalPrice = calculateTotalPrice(productInformationFromCart); //its string with $ sign 
        
        const session = await stripe.checkout.sessions.create({
            //information 
            payment_method_types: ['card'], // different way to accept so we choose just card
            mode: 'payment',
            line_items: productInformationFromCart.map((item) => (
                {
                    price_data: {
                        currency: 'USD',
                        product_data: {
                            name: item.productName
                        },
                        unit_amount: (parseFloat(item.priceAfterDiscount)+parseFloat(item.priceAfterDiscount)*0.05).toFixed(2) * 100 
                    },
                    quantity: item.quantity,
                    
                }
            )),
            success_url: `${process.env.CLIENT_LOCAL_HOST}cart`, //where will send client on success 
            cancel_url: `${process.env.CLIENT_LOCAL_HOST}cart`,
            metadata: {
                userId: res.locals.id,
                productInformationFromCart: JSON.stringify(productInformationFromCart),
                address: address,
              },  // where will send client in fail
        })
        
         return res.status(200).send({url:session.url});
        // before updating any data we will using stripe payment : 

     

    } catch (err) {
        console.log(err);
    }
}


module.exports = createOrder;
