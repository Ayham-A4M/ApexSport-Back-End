
const userModel = require('../../../models/UserModal')
const addToCart = async (req, res) => {

    const productInCart = { productId: req.body.productId, quantity: req.body.quantity, customes: req.body.customes }; //product cart is object with 2 properties first id of product second quantity of product
    const id = res.locals.id;

    const User = await userModel.findById(id)



    if (User.Cart.length === 0) { User.Cart = [productInCart] }
    else {
        const productIndex = User.Cart.findIndex(item => (productInCart.productId === item.productId&&JSON.stringify(productInCart.customes)===JSON.stringify(item.customes)));
        if (productIndex !== -1) {
            User.Cart[productIndex].quantity += productInCart.quantity;
        } else {
            User.Cart.push(productInCart);
        }
    }
    // finally we should to Update the user in db
    userModel.findByIdAndUpdate(id, { Cart: User.Cart }).then((result) => {
        return res.status(200).send({
            msg: 'Product has been added to cart',
        });
    })
}

module.exports = addToCart