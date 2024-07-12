import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './DeleteMessagePopup.css'
import { baseURL } from '../../utils/baseUrl'
import { Trash } from 'react-bootstrap-icons'

const DeleteMessagePopup = ({ text, id, itemType, onClose }) => {
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState(false)

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        onClose()
        if (itemType === 'user') {
          navigate('/')
        }
      }, 2000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [successMessage, onClose, navigate])

  const handleConfirm = () => {
    if (itemType === 'user') {
      deleteUser(id)
    } else if (itemType === 'review') {
      deleteReview(id)
    }
  }

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${baseURL}/user/${userId}`)
      console.log(response.data.message)
      setSuccessMessage(response.data.message)
      localStorage.removeItem('loggedInUser')
    } catch (error) {
      console.error('Error deleting user:', error)
      onClose()
    }
  }

  const deleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(`${baseURL}/reviews/${reviewId}`)
      setSuccessMessage('Review deleted successfully!')
    } catch (error) {
      console.error('Error deleting review:', error)
      onClose()
    }
  }

  return (
    <div className='popup-overlay'>
      <div className='middle-pls'>
        {successMessage && <div className='alert alert-success'>{successMessage}</div>}
        <div className='popup-content'>
          <Trash className='popup-trash-icon' />
          <p className='popup-text'>{text}</p>
          <div className='popup-buttons'>
            {!successMessage && (
              <>
                <button className='popup-close-button' onClick={onClose}>
                  Close
                </button>
                <button className='popup-confirm-button' onClick={handleConfirm}>
                  Confirm
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteMessagePopup
