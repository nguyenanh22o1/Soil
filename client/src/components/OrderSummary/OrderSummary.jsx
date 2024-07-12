import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import CartContext from '../ShoppingCart/CartContext'
import './OrderSummary.css'

const OrderSummaryPopup = ({ orderDetails, cartId, onClose }) => {
  const navigate = useNavigate()
  const { clearCart } = useContext(CartContext)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))

  useEffect(() => {
    const createOrder = async () => {
      try {
        // api request to create order
        const response = await axios.post('http://localhost:8000/v1/order/create', {
          userId: loggedInUser.id,
          orderDetails,
          cartId
        })
        const { orderId } = response.data

        // api request to retrieve order summary with order id
        const orderResponse = await axios.get(`http://localhost:8000/v1/order/${orderId}`)
        setOrder(orderResponse.data)

        // clear the cart context
        clearCart()
      } catch (error) {
        console.error('Error creating order:', error)
      } finally {
        setLoading(false)
      }
    }

    createOrder()
  }, [])

  const handleClose = () => {
    onClose()
    navigate('/')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  const orderDate = order && order.orderDate ? new Date(order.orderDate).toLocaleString() : 'Date not available'

  return (
    <div className='popup-overlay'>
      <div className='popup-container'>
        <div className='popup-box'>
          <div className='popup-header'>
            <h5>Order Summary</h5>
          </div>
          <div className='popup-body'>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Date/Time:</strong> {orderDate}</p>
            <p><strong>User:</strong> {`${loggedInUser.firstName} ${loggedInUser.lastName}`}</p>
            <hr />
            {order.orderDetails && order.orderDetails.map(item => (
              <div key={item.id} className='item-row'>
                <div>{item.productName}</div>
                <div>Quantity: {item.quantity}</div>
                <div>${Number(item.productPrice).toFixed(2)}</div>
              </div>
            ))}
            <hr />
            <p className='total-amount'><strong>Total Amount:</strong> ${Number(order.totalPrice).toFixed(2)}</p>
          </div>
          <div className='popup-footer'>
            <button type='button' className='btn btn-secondary' onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummaryPopup
