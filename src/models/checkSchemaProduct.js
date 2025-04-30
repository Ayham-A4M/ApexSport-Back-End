const checkSchemaProduct={
    ProductName: {
        isString:true, notEmpty:true,isLength:{options:{min:3}}, exists: {
            errorMessage: "Product Name is required"
        },
    },
    Catagory: {
        isString:true, notEmpty:true,isLength:{options:{min:3}}, exists: {
            errorMessage: "Product Name is required"
        },
    },
    Brand: {
        isString:true, notEmpty:true,isLength:{options:{min:3}}, exists: {
            errorMessage: "Product Name is required"
        },
    },
    Price: {
        isString:true, notEmpty:true,isLength:{options:{min:3}}, exists: {
            errorMessage: "Product Name is required"
        },
    },
    Description: {
        isString:true, notEmpty:true,isLength:{options:{min:3}}, exists: {
            errorMessage: "Product Name is required"
        },
    },
    Images:{
        require:true
    }
}
module.exports=checkSchemaProduct;