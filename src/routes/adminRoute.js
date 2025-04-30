require('dotenv').config();
const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin');
const getStatistics = require('../controller/admin/getStatistics');
const getOrdersStatus = require('../controller/admin/getOrdersStatus')
const TopProducts = require('../controller/admin/TopProducts');
const getLast7DaysIncome = require('../controller/admin/getLast7DaysIncome');
const getAllProducts = require('../controller/admin/getAllProducts');
const deleteProduct = require('../controller/admin/deleteProduct');
const editProduct = require('../controller/admin/editProduct');
const getOrders = require('../controller/admin/getOrders');
const multer = require('multer');
const updateOrderStatus = require('../controller/admin/updateOrderStatus');
const upload = multer({ storage: multer.memoryStorage() }); // No disk storage!

router.get('/api/getStatistics', getStatistics);
router.get('/api/getOrdersStatus', getOrdersStatus);
router.get('/api/TopProducts', TopProducts);
router.get('/api/last7Days', getLast7DaysIncome);
router.get('/api/allProducts', getAllProducts);
router.post('/api/deleteProduct', deleteProduct);
router.post('/api/editProduct', verifyAdmin, upload.array('images'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, msg: 'No images uploaded' });
        }

        // Upload each file to Vercel Blob
        const uploadPromises = req.files.map(async (file) => {
            const fileName = `${path.parse(file.originalname).name}-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

            const blob = await put(fileName, file.buffer, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN // Make sure this is in your .env
            });

            return blob.url;
        });

        const imageUrls = await Promise.all(uploadPromises);

        // Now pass the image URLs to your controller
        req.body.images = imageUrls; // Attach URLs to req.body
        return editProduct(req, res); // Call your existing controller
    } catch (err) {
        console.error('Blob upload error:', err);
        return res.status(500).json({
            success: false,
            msg: 'Failed to upload images',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});
router.get('/api/orders', getOrders)
router.post('/api/updateOrderStatus', updateOrderStatus)
module.exports = router;