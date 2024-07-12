const express = require('express')
const productController = require('../controllers/productController')
const router = express.Router()

// Fetch all products
router.get('/', productController.getAllProducts)

// Fetch specials
router.get('/specials', productController.getSpecials)

// Fetch featured products
router.get('/featured', productController.getFeaturedProducts)

// Fetch featured specials
router.get('/featured-specials', productController.getFeaturedSpecials)

// Fetch product by ID
router.get('/:id', productController.getProductById)

// Update product rating
router.put('/:id/rating', productController.updateProductRating)

module.exports = router
