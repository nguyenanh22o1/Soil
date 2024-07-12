import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import axios from 'axios'
import ReviewBox from '../src/components/ReviewBox/ReviewBox'
import ReviewForm from '../src/components/ReviewBox/ReviewForm'

jest.mock('axios')

const TestReviewComponent = () => {
  return (
    <Router>
      <ReviewForm userId={1} productId={1} onReviewUpdated={jest.fn()} />
      <ReviewBox review={{ id: 1, userId: 1, userRating: 5, text: 'Great product!', User: { firstName: 'Test' } }} onReviewUpdated={jest.fn()} onReviewDeleted={jest.fn()} />
    </Router>
  )
}

describe('Review Feature', () => {
  beforeEach(() => {
    // Mock API responses
    axios.post.mockClear()
    axios.put.mockClear()
    axios.delete.mockClear()

    // Mock cart data fetching with the expected format
    axios.get.mockResolvedValue({ data: { cart: { items: [], totalAmount: 0 } } })

    // Set the user ID in local storage to simulate a logged-in user
    localStorage.setItem('loggedInUser', JSON.stringify({ id: 1, firstName: 'Test', lastName: 'User', following: '' }))
  })

  afterEach(() => {
    // Clean up local storage
    localStorage.removeItem('loggedInUser')
  })

  /*
  This test simulates a user creating a new review for a product. An important test...
  */
  test('Create a review', async () => {
    axios.post.mockResolvedValueOnce({
      data: { id: 1, userId: 1, productId: 1, userRating: 5, text: 'Great product!' }
    })

    await act(async () => {
      render(<TestReviewComponent />)
    })

    await act(async () => {
      fireEvent.click(screen.getAllByText('★')[4]) // Select a 5-star rating
      fireEvent.change(screen.getByLabelText(/Review:/i), { target: { value: 'Great product!' } })
      fireEvent.click(screen.getByText('Submit Review'))
    })

    await waitFor(() => {
      expect(screen.getByText('Review submitted successfully!')).toBeInTheDocument()
    })
  })

  /*
  This test simulates a user successfully editing a past review of a product
  */
  test('Update a review', async () => {
    axios.put.mockResolvedValueOnce({
      data: { id: 1, userId: 1, productId: 1, userRating: 4, text: 'Updated review' }
    })

    await act(async () => {
      render(<TestReviewComponent />)
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Edit'))
      fireEvent.click(screen.getAllByText('★')[3]) // Select a 4-star rating
      fireEvent.change(screen.getByLabelText(/Review:/i), { target: { value: 'Updated review' } })
      fireEvent.click(screen.getByText('Save'))
    })

    await waitFor(() => {
      expect(screen.getByText('Review updated successfully!')).toBeInTheDocument()
      expect(screen.getByText('Updated review')).toBeInTheDocument()
    })
  })

     /*
  This test simulates a user deleting their own review of a product.
  */
  test('Delete a review', async () => {
    axios.delete.mockResolvedValueOnce({})

    let container
    await act(async () => {
      container = render(<TestReviewComponent />).container
    })

    await act(async () => {
      fireEvent.click(container.querySelector('.delete-icon'))
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Confirm'))
    })

    await waitFor(() => {
      expect(screen.getByText('Review deleted successfully!')).toBeInTheDocument()
    })
  })

     /*
  This is a test to simulate a user entering invalid input for their review, in this case
  entering a text exceeding 100 characters. no penalty pls :C
  */
  test('Submit a review with invalid input', async () => {
    await act(async () => {
      render(<TestReviewComponent />)
    })

    await act(async () => {
      fireEvent.click(screen.getAllByText('★')[4]) // Select a 5-star rating
      fireEvent.change(screen.getByLabelText(/Review:/i),
        { target: { value: '11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111' } })
      fireEvent.click(screen.getByText('Submit Review'))
    })

    await waitFor(() => {
      expect(screen.getByText('Review must be between 1 and 100 characters.')).toBeInTheDocument()
    })
  })

     /*
  This is a test to simulate a user creating, updating then deleting a review.
  Why? Because it's what a user would normally do. 
  */
  test('Substantial test: Create, update, and delete a review', async () => {
    // Mock API responses for creating, updating, and deleting a review
    axios.post.mockResolvedValueOnce({
      data: { id: 1, userId: 1, productId: 1, userRating: 5, text: 'Great product!' }
    })

    axios.put.mockResolvedValueOnce({
      data: { id: 1, userId: 1, productId: 1, userRating: 4, text: 'Updated review' }
    })

    axios.delete.mockResolvedValueOnce({})

    let container
    await act(async () => {
      container = render(<TestReviewComponent />).container
    })

    // Create a review
    await act(async () => {
      fireEvent.click(screen.getAllByText('★')[4]) // Select a 5-star rating
      fireEvent.change(screen.getByLabelText(/Review:/i), { target: { value: 'Great product!' } })
      fireEvent.click(screen.getByText('Submit Review'))
    })

    await waitFor(() => {
      expect(screen.getByText('Review submitted successfully!')).toBeInTheDocument()
    })

    // Update the review
    await act(async () => {
      fireEvent.click(screen.getByText('Edit'))
      fireEvent.click(screen.getAllByText('★')[3]) // Select a 4-star rating
      fireEvent.change(screen.getByLabelText(/Review:/i), { target: { value: 'Updated review' } })
      fireEvent.click(screen.getByText('Save'))
    })

    await waitFor(() => {
      expect(screen.getByText('Review updated successfully!')).toBeInTheDocument()
      expect(screen.getByText('Updated review')).toBeInTheDocument()
    })

    // Delete the review
    await act(async () => {
      fireEvent.click(container.querySelector('.delete-icon'))
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Confirm'))
    })

    await waitFor(() => {
      expect(screen.getByText('Review deleted successfully!')).toBeInTheDocument()
    })
  })
})

export default TestReviewComponent
