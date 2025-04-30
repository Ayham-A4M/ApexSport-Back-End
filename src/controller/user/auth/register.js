const userModel = require('../../../models/UserModal')
const { validationResult } = require('express-validator');
const bcrybt = require('bcryptjs');
const register = (req, res) => {

    const resultValidation = validationResult(req);// the result of validation schema array of errors
    if (!resultValidation.isEmpty()) { return res.status(402).send(resultValidation); }
    let userInfo = req.body;
    userModel.findOne({ $or: [{ UserName: userInfo.UserName }, { Email: userInfo.Email }] }).exec().then((user) => {
        // if we have user with the same user name or email then we cant save the register else we start proccess to save register
        if (user) {
            return res.status(403).send({ msg: 'sorry UserName or Email are exist try another one' })
        }
        const hashPass =  bcrybt.hashSync(userInfo.password, 10);
        userInfo.password = hashPass;
        userInfo.Role = 'user';
        userInfo.Cart = [];
        userInfo.WishList = [];

        const new_User = new userModel(userInfo);

        new_User.save().then((user) => {
            return res.status(201).send('User saved successfully please now login');
        }).catch((err) => {
            return res.status(401).send({msg:'server error'});
        });



    }).catch((err) => {
        return res.status(400).send({msg:'server error'});
    })

}


module.exports = register