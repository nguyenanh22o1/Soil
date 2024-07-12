import React, { createContext, useReducer, useEffect } from 'react'
import axios from 'axios'

const CartContext = createContext()

const initialCartState = {
  items: [],
  totalAmount: 0
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART': {
      return {
        ...state,
        items: action.cart.items,
        totalAmount: action.cart.totalAmount
      }
    }
    default:
      return state
  }
}

const fetchCart = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:8000/v1/cart/${userId}`)
    const cart = response.data

    if (!cart || !cart.CartItems) {
      throw new Error('Invalid cart format received')
    }

    const items = cart.CartItems.map((cartItem) => {
      const product = cartItem.Product
      const price = parseFloat(product.salePrice) !== 0 ? parseFloat(product.salePrice) : parseFloat(product.originalPrice)
      return {
        productId: product.id,
        name: product.name,
        price,
        imageUrl: product.imageSrc,
        amount: cartItem.quantity
      }
    })

    const totalAmount = items.reduce((acc, item) => acc + item.price * item.amount, 0)

    return { items, totalAmount }
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching cart data')
  }
}

const addItemToCartAPI = async (userId, productId) => {
  try {
    const response = await axios.post('http://localhost:8000/v1/cart/add', {
      userId,
      productId,
      quantity: 1
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Error adding item to cart')
  }
}

const removeItemFromCartAPI = async (userId, productId) => {
  try {
    await axios.delete('http://localhost:8000/v1/cart/remove', {
      data: {
        userId,
        productId
      }
    })
    return true
  } catch (error) {
    console.error(error)
    throw new Error('Error removing item from cart')
  }
}

const clearCartAPI = async (userId) => {
  try {
    await axios.post('http://localhost:8000/v1/cart/clear', {
      userId
    })
    return true
  } catch (error) {
    console.error(error)
    throw new Error('Error clearing cart')
  }
}

const updateItemQuantityAPI = async (userId, productId, quantity) => {
  try {
    const response = await axios.post('http://localhost:8000/v1/cart/update', {
      userId,
      productId,
      quantity
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Error updating item quantity')
  }
}

export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState)

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
      if (loggedInUser) {
        const userId = loggedInUser.id
        try {
          const cart = await fetchCart(userId)
          dispatch({ type: 'SET_CART', cart })
        } catch (error) {
          console.error('Failed to load cart', error)
        }
      }
    }

    fetchUserData()
  }, [])

  const addItemToCart = async (productId) => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    if (loggedInUser) {
      const userId = loggedInUser.id
      try {
        await addItemToCartAPI(userId, productId)
        const cart = await fetchCart(userId) // refresh cart
        dispatch({ type: 'SET_CART', cart })
      } catch (error) {
        console.error('Failed to add item to cart', error)
      }
    }
  }

  const removeItemFromCart = async (productId) => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    if (loggedInUser) {
      const userId = loggedInUser.id
      try {
        await removeItemFromCartAPI(userId, productId)
        const cart = await fetchCart(userId) // refresh cart
        dispatch({ type: 'SET_CART', cart })
      } catch (error) {
        console.error('Failed to remove item from cart', error)
      }
    }
  }

  const clearCart = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    if (loggedInUser) {
      const userId = loggedInUser.id
      try {
        await clearCartAPI(userId)
        dispatch({ type: 'SET_CART', cart: { items: [], totalAmount: 0 } })
      } catch (error) {
        console.error('Failed to clear cart', error)
      }
    }
  }

  const updateItemQuantity = async (productId, quantity) => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    if (loggedInUser) {
      const userId = loggedInUser.id
      try {
        await updateItemQuantityAPI(userId, productId, quantity)
        const cart = await fetchCart(userId)
        dispatch({ type: 'SET_CART', cart })
      } catch (error) {
        console.error('Failed to update item quantity', error)
      }
    }
  }

  return (
    <CartContext.Provider
      value={{
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItemToCart,
        removeItemFromCart,
        clearCart,
        updateItemQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
