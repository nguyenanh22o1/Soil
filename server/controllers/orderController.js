const db = require('../database')

const createOrder = async (req, res) => {
  const { userId, orderDetails, cartId } = req.body
  if (!userId || !orderDetails || orderDetails.length === 0) {
    return res.status(400).json({ error: 'Invalid order details' })
  }

  try {
    // Calculate total price
    let totalPrice = 0
    for (const detail of orderDetails) {
      totalPrice += detail.price * detail.amount
    }

    // Create order
    const order = await db.order.create({
      userId,
      totalPrice,
      orderDate: new Date()
    })

    // Create order details with product details
    for (const detail of orderDetails) {
      const product = await db.product.findByPk(detail.productId)
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${detail.productId} not found` })
      }
      await db.orderDetails.create({
        orderId: order.id,
        productId: product.id,
        productName: product.name,
        productPrice: parseFloat(detail.price),
        quantity: detail.amount
      })
    }

    // Clear the user's cart
    await db.cartItem.destroy({ where: { cartId } })

    res.status(201).json({ message: 'Order created successfully', orderId: order.id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getOrderById = async (req, res) => {
  const { orderId } = req.params
  try {
    const order = await db.order.findOne({
      where: { id: orderId },
      include: [{
        model: db.orderDetails,
        as: 'orderDetails'
      }]
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.status(200).json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { createOrder, getOrderById }
