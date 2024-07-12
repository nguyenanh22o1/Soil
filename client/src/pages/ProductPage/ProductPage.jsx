import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import BigProductCard from '../../components/BigProductCard/BigProductCard'
import { baseURL } from '../../utils/baseUrl'
import axios from 'axios'
import ReviewBox from '../../components/ReviewBox/ReviewBox'
import './ProductPage.css'
import ReviewForm from '../../components/ReviewBox/ReviewForm'

const ProductPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [productDetails, setProductDetails] = useState(location.state || null)
  const [reviews, setReviews] = useState([])
  const [userId, setUserId] = useState(null)
  const [averageRating, setAverageRating] = useState(productDetails ? productDetails.rating : null)

  // Get user id
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    if (loggedInUser && loggedInUser.id) {
      setUserId(loggedInUser.id)
    } else {
      setUserId(null) // User is logged out
    }
  }, [])

  const handleReviewUpdated = () => {
    fetchReviews()
  }

  const handleReviewDeleted = () => {
    fetchReviews()
  }

  const fetchReviews = async () => {
    if (!productDetails) return
    try {
      const response = await axios.get(`${baseURL}/reviews/product/${productDetails.id}`)
      setReviews(response.data)
      fetchAverageRating() // Fetch the average rating after fetching reviews
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const fetchAverageRating = async () => {
    if (!productDetails) return
    try {
      const response = await axios.get(`${baseURL}/reviews/product/${productDetails.id}/average-rating`)
      setAverageRating(response.data.averageRating)
    } catch (error) {
      console.error('Error fetching average rating:', error)
    }
  }

  useEffect(() => {
    if (productDetails) {
      fetchReviews()
    }
  }, [productDetails])

  useEffect(() => {
    if (!productDetails) {
      navigate('/') // Redirect to home or another appropriate page
    }
  }, [productDetails, navigate])

  return (
    <>
      <NavigationBar />
      <div className='backgroundRectangle' />
      {productDetails ? (
        <>
          <div className='container'>
            <div className='row justify-content-center m-4 product-details-box mx-auto'>
              <a href='#' onClick={(e) => { e.preventDefault(); navigate(-1) }} className='back-link text-start'>Back</a>
              <BigProductCard {...productDetails} rating={averageRating} /> {/* Pass averageRating to BigProductCard */}
            </div>
          </div>

          <div className='container'>
            <div className='row justify-content-center product-details-box mx-auto p-3 m-4 shadow rounded-4 text-start' style={{ backgroundColor: '#ffff' }}>
              <h5>Product Description</h5>
              <p>{productDetails.description}</p>
            </div>
          </div>

          <div className='container'>
            <div className='row justify-content-center product-details-box mx-auto p-3 m-4 shadow rounded-4 text-start' style={{ backgroundColor: '#ffff' }}>
              <h5>Product Reviews</h5>
              {reviews.length === 0
                ? (
                  <p>No reviews available.</p>
                  )
                : (
                    reviews.map((review) => (
                      <ReviewBox
                        key={review.id}
                        review={review}
                        onReviewUpdated={handleReviewUpdated}
                        onReviewDeleted={handleReviewDeleted}
                      />
                    ))
                  )}

              <div>
                {userId
                  ? (
                    <ReviewForm
                      userId={userId}
                      productId={productDetails.id}
                      onReviewUpdated={handleReviewUpdated}
                    />
                    )
                  : (
                    <p>Please log in to submit a review.</p>
                    )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='container'>
          <div className='row justify-content-center m-4 product-details-box mx-auto'>
            <p>Loading product details...</p>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductPage
