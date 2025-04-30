const jwt = require('jsonwebtoken');
const userModel = require('../../../models/UserModal');
const getUserWhenLogin=(req,res)=>{
   
        const token = req.cookies.JWT;  // Get JWT from cookies
     
        if (!token) {
            return res.status(401).send({msg:`unauthorized`});
        }
    
        // Verify the JWT token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({msg:`unauthorized`});
            }
            userModel.findById(decoded.ID).then((user) => {
                if (!user) {
                    return res.status(404).send({msg:'No User'});
                } else {
                    return res.status(200).send({
                        FirstName: user.FirstName,
                        LastName: user.LastName,
                        Email: user.Email,
                        Role: user.Role,
                        UserName: user.UserName,
                        ID: user._id,
                    });
                }
            }).catch((err) => {
                return res.status(401).send(err);
            });
        });
    }
module.exports=getUserWhenLogin