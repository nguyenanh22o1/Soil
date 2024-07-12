const express = require('express')
const cartController = require('../controllers/cartController')
const { cart } = require('../database')
const router = express.Router()

router.get('/:userId', cartController.getCart)
router.post('/add', cartController.addItemToCart)
router.delete('/remove', cartController.removeItemFromCart)
router.post('/clear', cartController.clearCart)
router.post('/update', cartController.updateItemQuantity)

module.exports = router
