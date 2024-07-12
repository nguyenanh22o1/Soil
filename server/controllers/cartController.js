const db = require('../database')

// get cart details for specific user
const getCart = async (req, res) => {
  const { userId } = req.params
  try {
    // find cart, including cart items and product details
    const cart = await db.cart.findOne({
      where: { userId },
      include: [{ model: db.cartItem, include: [db.product] }]
    })
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }
    res.status(200).json(cart)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// add item quantity to user's cart
const addItemToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body
  try {
    // if a cart doesn't exist for user create one
    let cart = await db.cart.findOne({ where: { userId } })
    if (!cart) {
      cart = await db.cart.create({ userId })
    }

    const [cartItem, created] = await db.cartItem.findOrCreate({
      where: { cartId: cart.id, productId },
      defaults: { quantity }
    })

    // if cart exists, update product quantity
    if (!created) {
      cartItem.quantity += quantity
      await cartItem.save()
    }

    res.status(200).json(cartItem)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// remove item quantity from cart
const removeItemFromCart = async (req, res) => {
  const { userId, productId } = req.body
  try {
    const cart = await db.cart.findOne({ where: { userId } })
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    // find the cart item to be removed
    const cartItem = await db.cartItem.findOne({ where: { cartId: cart.id, productId } })
    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' })
    }

    // if quantity is greater than 1 decrease the quantity otherwise remove the item
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1
      await cartItem.save()
    } else {
      await cartItem.destroy()
    }

    res.status(200).json({ message: 'Item removed from cart' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// clear entire cart
const clearCart = async (req, res) => {
  const { userId } = req.body
  try {
    const cart = await db.cart.findOne({ where: { userId } })
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    // remove all items in the cart
    await db.cartItem.destroy({ where: { cartId: cart.id } })

    res.status(200).json({ message: 'Cart cleared' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// update the quantity of an item in the user's cart
const updateItemQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body
  try {
    const cart = await db.cart.findOne({ where: { userId } })
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    const cartItem = await db.cartItem.findOne({ where: { cartId: cart.id, productId } })
    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' })
    }

    // either update quantity or remove the item if quantity is 0
    if (quantity > 0) {
      cartItem.quantity = quantity
      await cartItem.save()
      res.status(200).json(cartItem)
    } else {
      await cartItem.destroy()
      res.status(200).json({ message: 'Item removed from cart' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getCart, addItemToCart, removeItemFromCart, clearCart, updateItemQuantity }
