const router = require('express').Router();
const verifyUser=require('../middleware/verifyUser')
const createOrder=require('../controller/createOrder');
const getUserOrder=require('../controller/getUserOrder');

router.post('/api/createOrder',verifyUser,createOrder);
router.get('/api/userOrders',verifyUser,getUserOrder);


module.exports=router