const orderModel = require('../../models/orderModel');
const getLast7DaysIncome = async (req, res) => {
    // Calculate the date 7 days ago from now
    let sevenDaysAgo = new Date(new Date() - (7 * 24 * 60 * 60 * 1000));

    let response = await orderModel.aggregate([
        {
            $addFields: {
                cleanedDate: {

                    $substrCP: [
                        "$Date",
                        0,
                        { $subtract: [{ $strLenCP: "$Date" }, 23] }
                    ]
                }
            }
        },
        {
            $addFields: {
                dateObject: { $toDate: "$cleanedDate" }
            }
        },
        {
            $match: {
                dateObject: {
                    $gte: sevenDaysAgo
                }
            }
        },
        {
            $project: {
                Date: "$cleanedDate",
                DateObject: "$dateObject",
                TotalPrice: "$TotalPrice"
            }
        }
    ])


    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const incomeByDay = [];
    while (sevenDaysAgo < new Date(new Date() - ((24 * 60 * 60 * 1000)))) {
        let object = { Day: `${days[sevenDaysAgo.getDay()]}`, Date: sevenDaysAgo.toLocaleDateString('en-GB') }
        let total = 0;
        response = response.filter((ele) => {
            if (ele.DateObject.toLocaleDateString('en-GB') == sevenDaysAgo.toLocaleDateString('en-GB')) {
                total += parseFloat(ele.TotalPrice);
                return false
            } else {
                return true
            }
        })
        object.total = total;
        incomeByDay.push(object);
        sevenDaysAgo = new Date(sevenDaysAgo.getTime() + (24 * 60 * 60 * 1000))
    }


   
    return res.status(200).send(incomeByDay)
}
module.exports = getLast7DaysIncome