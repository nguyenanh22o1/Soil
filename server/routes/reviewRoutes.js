const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')

router.post('/', reviewController.createReview)

router.put('/:id', reviewController.updateReview)

router.delete('/:id', reviewController.deleteReview)

router.get('/product/:productId', reviewController.getProductReviews)

router.get('/product/:productId/average-rating', reviewController.getAverageRating)

module.exports = router
