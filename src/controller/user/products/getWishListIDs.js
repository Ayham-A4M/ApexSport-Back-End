const userModel = require('../../../models/UserModal')
const jwt = require('jsonwebtoken')
const getWishListIDs = async (req, res) => {
    let userId=null;
    const token =req.cookies.JWT;
    if(!token){return res.status(200).send([])}
    jwt.verify(token , process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        try {
            if (err) {
                return res.status(401).send({ msg: 'token revoked' })
            }
             (decode && decode.ID) ? userId=decode.ID : false
        } catch (err) {
            return res.status(401).send({ msg: 'token revoked' })
        }
    });
  
    try {
        const WishList = await userModel.findById(userId).select('WishList').lean()
        if (WishList){
            return res.status(200).send(WishList.WishList);
        }
        throw 'server error'
    } catch (err) {
        return res.status(500).send({ msg: err })
    }
}
module.exports = getWishListIDs