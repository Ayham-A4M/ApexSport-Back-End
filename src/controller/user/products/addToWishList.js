const userModel=require('../../../models/UserModal')
const addToWishList = (req, res) => {

    const productId = req.body.productId; //product cart is object with 2 properties first id of product second quantity of product
    const userId = res.locals.id
    userModel.findByIdAndUpdate(userId, { $push: { WishList: productId } }).then((response) => {
        return res.status(200).send({ msg: "product added succesfully" })
    }).catch((err) => { return res.status(500).send({ msg: 'operation faild try again' }) })
}
module.exports = addToWishList