import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartPlus } from 'react-bootstrap-icons'
import axios from 'axios'
import img from '../../assets/images/apples.jpg'
import CartContext from '../ShoppingCart/CartContext'
import './ProductCard.css'

const ProductCard = ({
  id = 0,
  name = 'Apples',
  description = 'Juicy red apples',
  salePrice = '0.00',
  originalPrice = '0.00',
  imageSrc = img,
  category = 'fruits'
}) => {
  const navigate = useNavigate()
  const { addItemToCart } = useContext(CartContext)
  const [rating, setRating] = useState(0)
  const [loginMessage, setLoginMessage] = useState('')

  useEffect(() => {
    // Function to fetch the average rating and update the product rating
    const fetchAverageRatingAndUpdateProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/v1/reviews/product/${id}/average-rating`)
        const averageRating = response.data.averageRating
        setRating(averageRating)

        // Update the product rating with the average rating
        await axios.put(`http://localhost:8000/v1/products/${id}/rating`, { rating: averageRating })
      } catch (error) {
        console.error('Failed to fetch average rating and update product rating', error)
      }
    }

    fetchAverageRatingAndUpdateProduct()
  }, [id])

  const handleAddToCart = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      const user = JSON.parse(localStorage.getItem('loggedInUser'))
      if (!user) {
        setLoginMessage('Please log in to add items to your cart.')
        return
      }
      await addItemToCart(id)
      setLoginMessage('') // Clear the message if item is added successfully
    } catch (error) {
      console.error('Failed to add item to cart', error)
    }
  }

  const navigateToProductDetail = () => {
    navigate(`/product/${id}`, { state: { id, name, description, salePrice, originalPrice, imageSrc, category, rating } })
  }

  const priceToDisplay = salePrice !== '0.00' ? `$${salePrice}` : `$${originalPrice}`
  const priceClass = salePrice !== '0.00' ? 'text-danger' : 'text-success'

  // Generate stars based on rating
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={`star ${index < rating ? 'filled-star' : ''}`}>★</span>
  ))

  return (
    <div>
      {loginMessage && <div className="alert alert-danger">{loginMessage}</div>}
      <div className='product-card' onClick={navigateToProductDetail}>
        <img src={imageSrc} className='img-top' alt={name} />
        <div className='card-contents'>
          <div className='card-pricing'>
            <h1 className={priceClass}>{priceToDisplay}</h1>
            {salePrice !== '0.00' && <span className='original-price'>${originalPrice}</span>}
          </div>
          <h4 className='card-header'>{name}</h4>
          <p className='card-category'>{category}</p>
          <div className='rating'>{stars}</div>
          <button className='btn btn-custom-add-cart' onClick={handleAddToCart}>
            <CartPlus className='btn-add-cart-icon' /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
