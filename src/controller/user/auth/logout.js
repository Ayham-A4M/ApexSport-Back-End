const userModel=require('../../../models/UserModal');
const jwt=require('jsonwebtoken')
const logout=(req,res)=>{
   
        const token = req.cookies.JWT;  // Get JWT from cookies
        if (!token) {
            return res.status(400).send(`No JWT token`);
        } else {
            jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,decode)=>{
                const response=await userModel.findByIdAndUpdate(decode.ID,{$inc:{TokenVersion:1}});
            })
           
            res.clearCookie('JWT', { httpOnly: true, sameSite: 'None', secure: true });
            res.clearCookie('RefreshToken',{ httpOnly: true, sameSite: 'None', secure: true });
            res.status(200).send({ msg: "logout done !! " });
        }
}
module.exports=logout