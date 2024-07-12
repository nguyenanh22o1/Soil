import React, { useState, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import CartContext from '../../components/ShoppingCart/CartContext'
import OrderSummaryPopup from '../../components/OrderSummary/OrderSummary'
import './CheckoutPage.css'

const CheckoutPage = () => {
  const { items, totalAmount, removeItemFromCart, addItemToCart, updateItemQuantity, clearCart } = useContext(CartContext)
  const [showSummary, setShowSummary] = useState(false)
  const [error, setError] = useState('')
  const [address, setAddress] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('')
  const [expiryYear, setExpiryYear] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [orderDetails, setOrderDetails] = useState(null)
  const [cartId, setCartId] = useState('')

  // Check if user is logged in to proceed to submit order
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))

  // Handle input changes for MM, YY, and CVV
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value)
    setError('')
  }

  // Simple Credit detail validations
  const validateCardNumber = (number) => /^\d{16}$/.test(number)
  const validateExpiryMonth = (month) => month >= 1 && month <= 12
  const validateExpiryYear = (year) => year >= 0 && year <= 99
  const validateCvv = (cvv) => /^\d{3}$/.test(cvv)

  const validateExpiryDate = (month, year) => {
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1
    const expMonth = parseInt(month, 10)
    const expYear = parseInt(year, 10)
    return expYear > currentYear || (expYear === currentYear && expMonth >= currentMonth)
  }

  // Remove item from the cart
  const handleRemoveFromCart = (id) => {
    removeItemFromCart(id)
  }

  // Add item to the cart
  const handleAddToCart = (id) => {
    addItemToCart(id)
  }

  const handleQuantityChange = (id, value) => {
    if (value === '') {
      updateItemQuantity(id, '')
    } else {
      const quantity = parseInt(value, 10)
      if (!isNaN(quantity) && quantity >= 0) {
        updateItemQuantity(id, quantity)
      }
    }
  }

  const handleQuantityBlur = (id, value) => {
    const quantity = parseInt(value, 10)
    if (isNaN(quantity) || quantity <= 0) {
      removeItemFromCart(id)
    } else {
      updateItemQuantity(id, quantity)
    }
  }

  // Clear cart
  const handleClearCart = () => {
    clearCart()
  }

  const handleSubmitOrder = (e) => {
    e.preventDefault()
    // Check if user is logged in
    if (!loggedInUser) {
      setError('Please login or sign up to submit order')
      return
    }
    // Check if the cart is empty
    if (items.length === 0) {
      setError('Your cart is empty. Please add items before submitting your order.')
      return
    }
    if (!validateCardNumber(cardNumber)) {
      setError('Invalid card number. Card number must have 16 digits.')
      return
    }
    if (!validateExpiryDate(expiryMonth, expiryYear)) {
      setError('The card has expired.')
      return
    }
    if (!validateExpiryMonth(expiryMonth)) {
      setError('Invalid expiry month. It must be between 01 and 12.')
      return
    }
    if (!validateExpiryYear(expiryYear)) {
      setError('Invalid expiry year. It must be a 2-digit number.')
      return
    }
    if (!validateCvv(cvv)) {
      setError('Invalid CVV. It must be a 3-digit number.')
      return
    }
    // set order details and show order summary if validations pass
    setOrderDetails(items)
    setShowSummary(true)
  }

  return (
    <>
      <NavigationBar />
      <div className='backgroundRectangle' />
      <div className='container d-flex justify-content-center align-items-center p-5'>
        <div className='row p-3 cart-checkout-box justify-content-center'>
          <h1>Checkout</h1>
          <div className='col-md-6 bg-white border rounded-2 p-3 shadow m-1'>
            <div className='cart-title-clear text-start'>
              <span className='cart-title'>Your Cart</span>
              <button className='cart-clear rounded-2' onClick={() => handleClearCart()}>Clear All</button>
            </div>
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
          <div className='col-md-5 bg-white border rounded-2 p-3 shadow m-1'>
            <div className='row'>
              <div className='col-md-6'>
                <div className='text-start'>
                  <h4>Total: ${totalAmount.toFixed(2)}</h4>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='text-end'>${totalAmount.toFixed(2)}</div>
              </div>
            </div>
            <h5 className='text-start'>Credit Card Details</h5>
            <p className='text-start'>Not encrypted payment</p>
            <form onSubmit={handleSubmitOrder}>
              {error && <div className='alert alert-danger'>{error}</div>}
              <div className='mb-3'>
                <input
                  type='address'
                  className='form-control form-control-lg bg-light fs-6'
                  placeholder='Billing Address'
                  id='address'
                  value={address}
                  onChange={handleInputChange(setAddress)}
                />
              </div>
              <div className='mb-3'>
                <input
                  type='text'
                  className='form-control form-control-lg bg-light fs-6'
                  placeholder='Card Number'
                  id='cardNumber'
                  value={cardNumber}
                  onChange={handleInputChange(setCardNumber)}
                />
              </div>
              <div className='row mb-3'>
                <div className='col'>
                  <input
                    type='text'
                    className='form-control form-control-lg bg-light fs-6'
                    placeholder='Exp MM'
                    id='expiryMonth'
                    maxLength='2'
                    value={expiryMonth}
                    onChange={handleInputChange(setExpiryMonth, 2)}
                  />
                </div>
                <div className='col'>
                  <input
                    type='text'
                    className='form-control form-control-lg bg-light fs-6'
                    placeholder='Exp YY'
                    id='expiryYear'
                    maxLength='2'
                    value={expiryYear}
                    onChange={handleInputChange(setExpiryYear, 2)}
                  />
                </div>
                <div className='col'>
                  <input
                    type='text'
                    className='form-control form-control-lg bg-light fs-6'
                    placeholder='CVV'
                    id='CVV'
                    maxLength='3'
                    value={cvv}
                    onChange={handleInputChange(setCvv, 3)}
                  />
                </div>
              </div>
              <button type='submit' className='btn btn-primary w-100'>
                Submit Order
              </button>
            </form>
            {showSummary && (
              <OrderSummaryPopup
                orderDetails={orderDetails}
                cartId={cartId}
                onClose={() => setShowSummary(false)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default CheckoutPage
