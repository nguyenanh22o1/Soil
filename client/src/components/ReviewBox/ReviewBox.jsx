import React, { useState, useEffect } from 'react';
import { Trash } from 'react-bootstrap-icons';
import './ReviewBox.css';
import axios from 'axios';
import DeleteMessagePopup from '../DeleteMessagePopup/DeleteMessagePopup';

const ReviewBox = ({ review, onReviewUpdated, onReviewDeleted }) => {
  const [editMode, setEditMode] = useState(false);
  const [updatedRating, setUpdatedRating] = useState(review.userRating);
  const [updatedText, setUpdatedText] = useState(review.text);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [userId, setUserId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [following, setFollowing] = useState(false);

  // get user id
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.id) {
      setUserId(loggedInUser.id);
      setFollowing(loggedInUser.following.includes(review.userId));
    }
  }, [review.userId]);

  const truncateText = (text) => {
    const words = text.trim().split(/\s+/);
    if (words.length > 100) {
      return words.slice(0, 100).join(' ') + '...';
    }
    return text;
  };

  const renderStarRating = (rating) => {
    const stars = Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled-star' : 'empty-star'}`}
        onClick={() => handleStarClick(index + 1)}
      >
        ★
      </span>
    ));
    return stars;
  };

  const handleStarClick = (rating) => {
    if (editMode) {
      setUpdatedRating(rating);
    }
  };

  // HANDLE close DELETE
  const handleCloseDeletePopUp = () => {
    setDeletePopUp(false);
    onReviewDeleted();
  };

  const handleSaveReview = async () => {
    // validation
    if (updatedText.trim().length < 1 || updatedText.trim().length > 100) {
      setErrorMessage('Review must be between 1 and 100 characters.');
      setSuccessMessage('');
      return;
    }

    try {
      await axios.put(`http://localhost:8000/v1/reviews/${review.id}`, {
        userRating: updatedRating,
        text: updatedText
      });
      setEditMode(false);
      setSuccessMessage('Review updated successfully!');
      setErrorMessage('');
      onReviewUpdated();
    } catch (error) {
      console.error('Error saving review:', error);
      setSuccessMessage('');
      setErrorMessage('An error occurred while updating the review.');
    }
  };

  const handleFollowToggle = async () => {
    const action = following ? 'unfollow' : 'follow';
    try {
      await axios.post(`http://localhost:8000/v1/user/${userId}/follow`, {
        followUserId: review.userId,
        action
      });
      setFollowing(!following);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  if (review.deletedByAdmin) {
    return (
      <div className='review-card'>
        <div className='review-text' style={{ color: 'red', textAlign: 'center' }}>
          [*** This review has been deleted by the admin ***]
        </div>
      </div>
    );
  }

  return (
    <div className='review-card'>
      {/* message */}
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

      <div className='row align-items-center'>
        <div className='col-6'>
          <div className='review-header'>
            <span className='user-name'>{review.User.firstName}</span>
            {review.userId !== userId && (
              <button className='btn btn-link pb-2' onClick={handleFollowToggle}>
                {following ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>
        <div className='col-6 d-flex justify-content-end'>
          <div className='ratingReview'>
            {editMode
              ? renderStarRating(updatedRating)
              : renderStarRating(review.userRating)}
          </div>
        </div>
      </div>

      {/* text input */}
      <div className='row mb-2'>
        {editMode
          ? (
            <input
              className='review-text-input'
              value={updatedText}
              onChange={(e) => setUpdatedText(e.target.value)}
            />
            )
          : (
            <div className='review-text'>
              {review.text}
            </div>
            )}
      </div>

      {/* buttons */}
      <div className='row'>
        <div className='col text-right'>
          {review.userId === userId
            ? (
                editMode
                  ? (
                    <>
                      <button className='btn btn-primary mr-2' onClick={handleSaveReview}>
                        Save
                      </button>
                      <button className='btn btn-secondary mr-2' onClick={() => setEditMode(false)}>
                        Cancel
                      </button>
                    </>
                    )
                  : (
                    <>
                      <button className='btn btn-primary mr-2' onClick={() => setEditMode(true)}>
                        Edit
                      </button>
                    </>
                    )
              )
            : <></>}
        </div>
        {review.userId === userId && (
          <div className='col text-end' onClick={() => setDeletePopUp(true)}>
            <Trash className='delete-icon' />
          </div>
        )}
        {deletePopUp && (
          <DeleteMessagePopup
            text='Are you sure about that?'
            id={review.id}
            itemType='review'
            onClose={handleCloseDeletePopUp}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewBox;
