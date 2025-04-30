const userModel = require('../../../models/UserModal')
const removeProductFromCart = async (req, res) => {

    const userId = res.locals.id;
    const productId = req.body.productId;
    const customes = req.body.customes;
    if (!productId || !userId) { return res.status(500).send({ msg: 'server error' }) }
    const Cart = await userModel.findById(userId, { Cart: true });
    const NewCart = Cart.Cart.filter((e) => {
        return (e.productId === productId ? JSON.stringify(e.customes) !== JSON.stringify(customes) : true);
    })
    userModel.findByIdAndUpdate(userId, { Cart: NewCart }).then((response) => {
        return res.status(200).send({ msg: 'Operation Complete', NewCart: NewCart });
    }).catch((err) => {
        return res.status(500).send({ msg: 'server error' })
    })
}

module.exports = removeProductFromCart