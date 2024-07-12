import React, { useState } from 'react'
import './ReviewForm.css'
import { baseURL } from '../../utils/baseUrl'
import axios from 'axios'

const ReviewForm = ({ userId, productId, onReviewUpdated }) => {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const renderStarRating = (rating) => {
    const stars = Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled-star' : 'empty-star'}`}
        onClick={() => handleStarClick(index + 1)}
      >
        ★
      </span>
    ))
    return stars
  }

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // validation
    if (rating === 0) {
      setErrorMessage('Please give a rating.')
      setSuccessMessage('')
      return
    }

    if (text.trim().length < 1 || text.trim().length > 100) {
      setErrorMessage('Review must be between 1 and 100 characters.')
      setSuccessMessage('')
      return
    }

    try {
      await axios.post(`${baseURL}/reviews`, {
        productId,
        userId,
        userRating: rating,
        text
      })

      setRating(0)
      setText('')
      setErrorMessage('')
      setSuccessMessage('Review submitted successfully!')
      onReviewUpdated()
    } catch (error) {
      console.error('Error submitting review:', error)
      setErrorMessage('An error occurred while submitting the review.')
      setSuccessMessage('')
    }
  }

  return (
    <div className='review-form'>
      {/* MESSAGE */}
      {successMessage && !errorMessage && (
        <div className='alert alert-success' style={{ width: '100%' }}>
          {successMessage}
        </div>
      )}
      {errorMessage && !successMessage && (
        <div className='alert alert-danger' style={{ width: '100%' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className='form-group d-flex align-items-center'>
          <label htmlFor='ratingReview' className='me-2'>Rating:</label>
          <div className='ratingReview'>{renderStarRating(rating)}</div>
        </div>

        <div className='form-group'>
          <label htmlFor='text'>Review:</label>
          <textarea
            id='text'
            className='form-control'
            rows='4'
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

        <div className='text-end'>
          <button type='submit' className='btn btn-primary'>
            Submit Review
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm
