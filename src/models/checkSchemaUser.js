const checkSchemaUser ={
    FirstName: {
        isString:true, notEmpty:true,isLength:{options:{min:3}}, exists: {
            errorMessage: "First Name is required"
        },
    },
    LastName: { isString:true, notEmpty:true,isLength:{options:{min:3}}, exists: {
        errorMessage: "Last Name is required"
    }, },
    UserName: {
        isString:true, notEmpty:true,isLength:{options:{min:3}}, exists: {
            errorMessage: "UserName is required"
        },
    },
    Email: { isEmail:{
        errorMessage:"the field must be an email"
    } , exists: {
        errorMessage: "Email is required"
    }, },
    password: { isLength: { options: { min: 8 },errorMessage:'the length of password minimum must be 8 char' }, exists: {
        errorMessage: "Password is required"
    }, }
}
module.exports=checkSchemaUser;