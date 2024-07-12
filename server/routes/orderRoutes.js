const express = require('express')
const orderController = require('../controllers/orderController')
const router = express.Router()

router.post('/create', orderController.createOrder)
router.get('/:orderId', orderController.getOrderById)

module.exports = router
