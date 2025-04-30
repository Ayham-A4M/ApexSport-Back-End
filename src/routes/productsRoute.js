
const router = require('express').Router();
const getProduct = require('../controller/getProduct');
const creatNewProduct = require('../controller/creatNewProduct');
const verifyAdmin = require('../middleware/verifyAdmin');
const multer = require('multer');
const getProductByID = require('../controller/getProductByID');
const getSimilarProducts = require('../controller/getSimilarProducts');
const { put } = require('@vercel/blob'); // Import Vercel Blob
const path = require('path');

// Configure Multer to use memory storage (since we'll upload directly to Vercel Blob)
const upload = multer({ storage: multer.memoryStorage() }); // No disk storage!

router.get('/api/products', getProduct);
router.get('/api/product', getProductByID);
router.get('/api/products/:catagory', getSimilarProducts);


router.post('/api/products', verifyAdmin, upload.array('images'), async (req, res) => {
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
    return creatNewProduct(req, res); // Call your existing controller
  } catch (err) {
    console.error('Blob upload error:', err);
    return res.status(500).json({ 
      success: false, 
      msg: 'Failed to upload images',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;


