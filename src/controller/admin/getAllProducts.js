const productModel = require('../../models/productModel')
const getAllProducts = async (req, res) => {


    const page = req.query.page || 0; //number of page index 0 => first page
    const limit = 10; // limit products in single page 
    const skip = ((page - 1) * limit < 0 ? 0 : (page - 1) * limit)


    const catagory = req.query.catagory;
    const searchByName = req.query.name;


    const maximumPrice = parseFloat(req.query.maxPrice) || 9999;
    const minimumPrice = parseFloat(req.query.minPrice) || 0;
    const findOption = (catagory && catagory !== "null" && catagory !== "undefined" && catagory !== "all") ? { Catagory: catagory } : {};
    
    if (searchByName && searchByName !== "null" && searchByName !== "undefined") {
        findOption.ProductName = {
            $regex: searchByName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), // to replace all specific charecter in user search 
            $options: 'i'
        };
    }
    if ((maximumPrice !== "null" && maximumPrice !== "undefined") && (minimumPrice !== "null" && minimumPrice !== "undefined")) {
        findOption.$expr = {
            $and:
                [
                    {
                        $gte: [
                            { $toDouble: { $trim: { input: "$Price", chars: "\\$" } } }, //  //$ to remove sign dollars from end the price text :)
                            minimumPrice
                        ]
                    },
                    {
                        $lte: [
                            { $toDouble: { $trim: { input: "$Price", chars: "\\$" } } },
                            maximumPrice
                        ]
                    }
                ]

        }
    }
    const numberOfProductsInDB = await productModel.countDocuments(findOption);
    try {
        const allProducts = await productModel.find(findOption, { Images: { $slice: 1 }, ProductName: true, InStock: true, Price: true, Catagory: true }).skip(skip).limit(limit).lean().exec();
        return res.status(200).send({
            allProducts,
            totalPages: ((numberOfProductsInDB % limit === 0) ? (numberOfProductsInDB / limit) : Math.floor((numberOfProductsInDB / limit)) + 1),

        });

    } catch (err) {
   
        return res.status(500).send({ msg: 'server error' })
    }


}
module.exports = getAllProducts