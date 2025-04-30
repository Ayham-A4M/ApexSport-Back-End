require('dotenv').config();
const express = require('express');
const router = express.Router();
const { checkSchema} = require('express-validator');
const checkSchemaUser = require('../models/checkSchemaUser');
const checkSchemaLoginUser = require('../models/checkSchemaLoginUser')
const verifyUser = require('../middleware/verifyUser')

// controller
const register = require('../controller/user/auth/register');
const login = require('../controller/user/auth/login');
const getUserWhenLogin = require('../controller/user/auth/getUserWhenLogin');
const logout = require('../controller/user/auth/logout');
const addToCart = require('../controller/user/products/addToCart');
const getProductsCart = require('../controller/user/products/getProductsCart');
const removeProductFromCart = require('../controller/user/products/removeProductFromCart')
const addToWishList = require('../controller/user/products/addToWishList')
const removeFromWishList = require('../controller/user/products/removeFromWishList')
const getWishList = require('../controller/user/products/getWishList')
const getWishListIDs = require('../controller/user/products/getWishListIDs')
// controller





router.post('/api/registerUser', checkSchema(checkSchemaUser), register);
router.post('/api/login', checkSchema(checkSchemaLoginUser), login);
router.post('/api/personalInformation', getUserWhenLogin);
router.post('/api/logout', logout);

router.put('/api/addToCart', verifyUser, addToCart);
router.put('/api/deleteProductFromCart', verifyUser, removeProductFromCart);
router.put('/api/addToWishList', verifyUser, addToWishList);
router.put('/api/removeFromWishList', verifyUser, removeFromWishList)

router.get('/api/productsCart', verifyUser, getProductsCart);
router.get('/api/getWishList', verifyUser, getWishList)
router.get('/api/getWishListIDS', getWishListIDs);


module.exports = router;
