const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModal')
const verifyUser = (req, res, next) => {
    const token = req.cookies.JWT;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decode) => {
        try {
            if (err || !decode) { throw err }

            if (decode.Role === "user") {
                const ValidUser = await UserModel.findById(decode.ID);
                if (ValidUser) {
                    res.locals.id = decode.ID; return next();
                }

            } else {
                return res.status(403).send({ msg: 'Request Blocked' });
            }

        } catch (err) {
            return res.status(401).send(err);
        }
    })
}
module.exports = verifyUser;