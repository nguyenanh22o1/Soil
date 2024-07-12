import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import CartContext from './CartContext'
import './CartSidebar.css'

const CartSidebar = () => {
  const { items, totalAmount, removeItemFromCart, addItemToCart, updateItemQuantity, clearCart } = useContext(CartContext)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const navigate = useNavigate()

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))

  const handleRemoveFromCart = (id) => {
    removeItemFromCart(id)
  }

  const handleAddToCart = (id) => {
    addItemToCart(id)
  }

  const handleQuantityChange = (id, value) => {
    if (value === '') {
      updateItemQuantity(id, '') // this doesnt woork loolol.
    } else {
      const quantity = parseInt(value, 10)
      if (!isNaN(quantity) && quantity >= 0) {
        updateItemQuantity(id, quantity)
      }
    }
  }

  // item would be removed if you backspace the current quantity as well lol.
  const handleQuantityBlur = (id, value) => {
    const quantity = parseInt(value, 10)
    if (isNaN(quantity) || quantity <= 0) {
      removeItemFromCart(id) // Remove item if input is invalid or zero
    } else {
      updateItemQuantity(id, quantity)
    }
  }

  const handleClearCart = () => {
    clearCart()
  }

  const triggerNotification = (msg) => {
    setNotificationMessage(msg)
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  useEffect(() => {
    let timeoutId
    if (!showNotification && notificationMessage) {
      timeoutId = setTimeout(() => {
        setNotificationMessage('')
      }, 500)
    }

    return () => clearTimeout(timeoutId)
  }, [showNotification, notificationMessage])

  const handleCheckout = () => {
    if (loggedInUser) {
      navigate('/checkout')
    } else {
      triggerNotification('Please log in or sign up to continue with the checkout.')
    }
  }

  return (
    <div className='cart-container'>
      <div className='cart-title-clear text-start'>
        <span className='cart-title'>Your Cart</span>
        <button className='cart-clear rounded-2' onClick={handleClearCart}>Clear All</button>
      </div>
      <div className='cart-sidebar'>
        {items.length > 0
          ? items.map((item) => (
            <div className='cart-product-card' key={item.productId}>
              <img src={item.imageUrl} alt={item.name} className='cart-product-image rounded-2' />
              <div className='cart-product-details'>
                <span className='cart-product-title text-start p-2'>{item.name}</span>
                <div className='cart-product-price-quantity'>
                  <span className='cart-product-price text-start'>${item.price.toFixed(2)}</span>
                  <div className='cart-product-quantity'>
                    <button className='cart-quantity-button rounded-2' onClick={() => handleRemoveFromCart(item.productId)}>-</button>
                    <input
                      type='text'
                      className='cart-quantity-input rounded-2'
                      value={item.amount || ''}
                      onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                      onBlur={(e) => handleQuantityBlur(item.productId, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleQuantityBlur(item.productId, e.target.value)
                        }
                      }}
                    />
                    <button className='cart-quantity-button rounded-2' onClick={() => handleAddToCart(item.productId)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))
          : <p>Your cart is empty.😔</p>}
      </div>
      <div className='cart-checkout-container'>
        <div className='cart-total text-start'>Total: ${totalAmount.toFixed(2)}</div>
        <button className='cart-checkout rounded-2' onClick={handleCheckout}>Checkout</button>
        <div className={`notification-checkout ${showNotification ? 'fade-in' : 'fade-out'}`}>
          {notificationMessage}
        </div>
      </div>
    </div>
  )
}

export default CartSidebar
