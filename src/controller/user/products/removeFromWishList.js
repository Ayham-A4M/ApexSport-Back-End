const userModel=require('../../../models/UserModal')
const removeFromWishList = (req, res) => {
    
        const productId = req.body.productId;
        const userId = res.locals.id
        userModel.findByIdAndUpdate(userId, { $pull: { WishList: productId } }).then((response) => {
            return res.status(200).send({ msg: "product removed succesfully" })
        }).catch((err) => { return res.status(500).send({ msg: 'operation faild try again' }) })
    }

module.exports = removeFromWishList