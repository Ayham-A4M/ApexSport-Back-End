const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../models/UserModal');
// for refreshing the token !! 
router.get('/api/refreshToken', (req, res) => {
   
    const refreshToken = req.cookies.RefreshToken;
  
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decode) => {
        try {
            
            if (err) {  return res.status(400).send('error'); }
            const user = await userModel.findById(decode.ID);
            if (user.TokenVersion != decode.TokenVersion) {
                
               
                return res.status(401).send({ msg: "Token revoked decode version" })
            }
            const Payload = {  UserName: user.UserName, Role: user.Role, ID: user._id,Email:user.Email,FirstName:user.FirstName,LastName:user.LastName  };
            const accessToken = jwt.sign(Payload, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m'});
            
            res.cookie('JWT', accessToken, { httpOnly: true, sameSite: 'None', secure: true,maxAge:15*60*1000});
            return res.status(200).send({});

        } catch (err) {
            return res.status(401).send({ msg: "Token revoked" });
        }
    })
})



module.exports = router
