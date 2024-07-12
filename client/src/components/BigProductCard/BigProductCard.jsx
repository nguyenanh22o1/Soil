import React, { useContext, useState } from 'react'
import { CartPlus } from 'react-bootstrap-icons'
import img from '../../assets/images/apples.jpg'
import CartContext from '../ShoppingCart/CartContext'
import './BigProductCard.css'

const BigProductCard = ({
  id = 0,
  name = 'Oranges',
  description = 'Juicy oranges',
  cultivation = 'Plant oranges',
  salePrice = '$3.00',
  originalPrice = '$5.00',
  imageSrc = img,
  category = 'Fruits',
  rating = 5
}) => {
  const { addItemToCart } = useContext(CartContext)
  const [loginMessage, setLoginMessage] = useState('')

  const handleAddToCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('loggedInUser'))
      if (!user) {
        setLoginMessage('Please log in to add items to your cart.')
        return
      }
      
      // Calculate product price, check if on sale
      const productPrice = salePrice !== '$0.00' && salePrice !== originalPrice ? parseFloat(salePrice.replace('$', '')) : parseFloat(originalPrice.replace('$', ''))
      
      // Add product to cart
      await addItemToCart(id)
      setLoginMessage('') // Clear the message if item is added successfully
      console.log(`Product ${name} added to cart successfully`)
    } catch (error) {
      console.error('Failed to add item to cart', error)
    }
  }

  // Check which price to display based on whether the item is on sale
  const priceToDisplay = salePrice !== '$0.00' && salePrice !== originalPrice ? salePrice : originalPrice
  const priceClass = salePrice !== '$0.00' && salePrice !== originalPrice ? 'text-danger fw-bold' : 'text-success fw-bold'
  const originalPriceClass = salePrice !== '$0.00' && salePrice !== originalPrice ? 'text-muted original-price' : 'd-none'

  // Generate stars based on rating
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={`star ${index < rating ? 'filled-star' : 'empty-star'}`}>★</span>
  ))

  return (
    <div>
      {loginMessage && <div className="alert alert-danger">{loginMessage}</div>}
      <div className='d-flex flex-row align-items-center border rounded-4 overflow-hidden bg-white'>
        <div className='flex-shrink-0'>
          <img src={imageSrc} className='big-product-img-fluid' alt={name} />
        </div>
        <div className='flex-grow-1 p-3'>
          <h1 className='h4'>{name}</h1>
          <p className='mb-2 text-muted'>{category}</p>
          <p className='mb-2'>
            <span className={originalPriceClass}>{originalPrice}</span>
            <span className={priceClass}>{priceToDisplay}</span>
          </p>
          <div className='mb-3'>{stars}</div>
          <button className='btn btn-success' onClick={handleAddToCart}>
            <CartPlus className='me-2' /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default BigProductCard