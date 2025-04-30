const checkSchemaLoginUser ={
    Email: { isEmail:{
        errorMessage:"the field must be an email"
    } , exists: {
        errorMessage: "Email is required"
    }, },
    password: {isString:true,isLength: { options: { min: 8 },errorMessage:'the length of password minimum must be 8 char' }, exists: {
        errorMessage: "Password is required"
    }, }
}
module.exports=checkSchemaLoginUser;