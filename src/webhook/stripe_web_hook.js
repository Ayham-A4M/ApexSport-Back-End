const { ObjectId } = require('mongoose').Types;
const userModel = require('../models/UserModal');
const orderModal = require('../models/orderModel');
const productModel = require('../models/productModel');
const express=require('express')
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_API_KEY)
const router = require('express').Router();

router.post('/stripe-webhook',express.raw({type: 'application/json'}),async (req, res) => {
    const sig = req.headers['stripe-signature']; //the siginture that come in header of req to this endpoint 
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET // the endpoint secret webhook that you have stripe listen ..... endpoint

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            try {
                const userId = session.metadata.userId; //userId from  data base that i send it with meta data
                const productInformationFromCart = JSON.parse(session.metadata.productInformationFromCart); // not product to save it its have some details aout each product
                // the user payment complete so its time to start update the data base 
                // Update stock
                const bulkOps = productInformationFromCart.map((product) => ({
                    updateOne: {
                        filter: { _id: new ObjectId(product.productId) },
                        update: { $inc: { InStock: -product.quantity, NumberOfOrder: +1 } },
                    },
                }));
                await productModel.bulkWrite(bulkOps);

                // Clear user's cart
                await userModel.findByIdAndUpdate(userId, { Cart: [] });

                // Save order
                const Order = {
                    Address: session.metadata.address,
                    UserId: userId,
                    TotalPrice: `${session.amount_total / 100}$`,
                    Tax: `${((session.amount_total /(1.05*100))*0.05 ).toFixed(2)}$`, // x + 0.05x == y => x(1+0.05)==y => x=y/(0.05+1) x original price *0.05 => tax 
                    Products: productInformationFromCart.reduce((acc, currentvalue) => {
                        acc.push({ productId: currentvalue.productId, quantity: currentvalue.quantity,custome:currentvalue.customes })
                        return acc;
                    }, []),
                    Status: 'pending',
                    Date: new Date(),
                };
                const OrderSave = new orderModal(Order);
                await OrderSave.save();
                return res.status(200).json({ received: true });
            } catch (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }

        default:
            return res.status(200).json({ received: true });
    }
});

module.exports = router
