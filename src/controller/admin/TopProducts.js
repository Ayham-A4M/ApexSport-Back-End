const productModel = require('../../models/productModel');
const TopProducts = async (req, res) => {
    try {
        const topProducts = await productModel.
            find({}, { Images: { $slice: 1 }, ProductName: true, NumberOfOrder: true, Price: true, DiscountPercentage: true }).
            sort({ NumberOfOrder: -1 }).limit(3).lean();
        return res.status(200).send(topProducts)
    } catch (err) {
        return res.status(500).send({ msg: 'server error' })
    }
}
module.exports = TopProducts