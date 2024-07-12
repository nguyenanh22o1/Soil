import React, { useState, useEffect } from 'react'
import { Trash } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'
import DeleteMessagePopup from '../DeleteMessagePopup/DeleteMessagePopup'
import { isValidEmail, isVaidPhonenumber } from '../../utils/validationUtils'
import { baseURL } from '../../utils/baseUrl'
import axios from 'axios'

const AccountGeneralTab = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [dateJoined, setDateJoined] = useState('')

  const [editModePersonal, setEditModePersonal] = useState(false)
  const [editModeContact, setEditModeContact] = useState(false)
  // const [activeTab, setActiveTab] = useState('account-general');

  // error message triggers
  const [errorMessagePersonalInfo, setErrorMessagePersonalInfo] = useState('')
  const [successMessagePersonalInfo, setSuccessMessagePersonalInfo] = useState('')

  const [errorMessageContactInfo, setErrorMessageContactInfo] = useState('')
  const [successMessageContactInfo, setSuccessMessageContactInfo] = useState('')

  // get data from loggedInUser
  const [deletePopUp, setDeletePopUp] = useState(false)
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))

  useEffect(() => {
    const fetchUserData = async () => {
      if (loggedInUser) {
        try {
          const response = await axios.get(`${baseURL}/user/${loggedInUser.id}`)
          const { data } = response
          setUser(data.user)
          setFirstName(data.user.firstName || '')
          setLastName(data.user.lastName || '')
          setEmail(data.user.email || '')
          setPhoneNumber(data.user.phoneNumber || '')
          setDateOfBirth(data.user.dateOfBirth || '')
          setDateJoined(data.user.dateJoined || '')
        } catch (error) {
          console.error('Error fetching user data:', error)
          // Handle error state
        }
      } else {
        navigate('/login')
      }
    }
    fetchUserData()
  }, [navigate])

  // HANDLE SAVE PERSONAL INFORMATION
  const handleSavePersonal = async () => {
    if (!firstName || !lastName) {
      setErrorMessagePersonalInfo('Name is required fields.')
      setSuccessMessagePersonalInfo('')
      return
    }

    try {
      const response = await axios.put(`${baseURL}/user/${user.id}/profile`, {
        firstName,
        lastName,
        dateOfBirth
      })

      const { data } = response
      setUser(data.user)
      setEditModePersonal(false)
      setErrorMessagePersonalInfo('')
      setSuccessMessagePersonalInfo('Saved')

      // store another version in local storage
      const updatedLoggedInUser = {
        ...loggedInUser,
        firstName,
        lastName
      }
      localStorage.setItem('loggedInUser', JSON.stringify(updatedLoggedInUser))
    } catch (error) {
      console.error('Error updating user profile:', error)
      // Handle error state
    }
  }

  // HANDLE SAVE CONTACT
  //
  const handleSaveContact = async () => {
    // check userinfo
    if (!isValidEmail(email)) {
      setErrorMessageContactInfo('Please enter a valid email address.')
      setSuccessMessageContactInfo('')
      return
    }

    if (!isVaidPhonenumber(phoneNumber) && phoneNumber !== '') {
      setErrorMessageContactInfo('Phone number is invalid')
      setSuccessMessageContactInfo('')
      return
    }

    try {
      const response = await axios.put(`${baseURL}/user/${user.id}/profile`, {
        email,
        phoneNumber
      })

      const { data } = response
      setUser(data.user)
      setEditModeContact(false)
      setErrorMessageContactInfo('')
      setSuccessMessageContactInfo('Saved')
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data
        setErrorMessageContactInfo(errorData.error)
        setSuccessMessageContactInfo('')
      }
    }
  }

  // HANDLE CANCEL EDIT
  const handleCancelPersonal = () => {
    setFirstName(user.firstName || '')
    setLastName(user.lastName || '')
    setDateOfBirth(user.dateOfBirth || '')
    setEditModePersonal(false)
  }
  const handleCancelContact = () => {
    setEmail(user.email || '')
    setPhoneNumber(user.phoneNumber || '')
    setEditModeContact(false)
  }

  // HANDLE close DELETE
  const handleCloseDeletePopUp = () => {
    setDeletePopUp(false)
  }

  return (
    <>
      <div className='tab-pane fade active show' id='account-general'>
        <div className='card-body'>

          {/* sub heading */}
          <div className='row'>
            <div className='col'>
              <h5 className='mb-4 text-start your-details'>Your details</h5>
            </div>
            <div className='col text-end' onClick={() => setDeletePopUp(true)}>
              <Trash className='delete-icon' />
            </div>
            {deletePopUp && (
              <DeleteMessagePopup
                text='Are your sure about that ?'
                id={user.id}
                itemType='user'
                onClose={handleCloseDeletePopUp}
              />
            )}
          </div>

          {/* error message */}
          {successMessagePersonalInfo && !errorMessagePersonalInfo && (
            <div className='alert alert-success' style={{ width: '100%' }}>
              {successMessagePersonalInfo}
            </div>
          )}
          {errorMessagePersonalInfo && !successMessagePersonalInfo && (
            <div className='alert alert-danger' style={{ width: '100%' }}>
              {errorMessagePersonalInfo}
            </div>
          )}

          {/* personal row */}
          <div className='row'>
            {/* Personal + edit */}
            <div className='row'>
              <div className='col'>
                <h6 className='mb-3 text-start personal-contact'>Personal </h6>

              </div>

              <div className='col text-end'>
                {!editModePersonal
                  ? (
                    <a href='#' className='ml-1 edit-link' onClick={() => setEditModePersonal(true)}>Edit</a>
                    )
                  : (
                    <>
                      <a href='#' className='ml-1 cancel-link' onClick={handleCancelPersonal}>Cancel</a>
                      <a href='#' className='ml-1 save-link' onClick={handleSavePersonal}>Save</a>
                    </>
                    )}
              </div>

            </div>

            {/* personal detail */}
            {/* FIRST NAME */}
            <div className='form-group text-start'>
              <label className='personal-detail'>First name:</label>
              <div>
                {editModePersonal
                  ? (
                    <input type='text' className='form-control personal-detail-thin' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    )
                  : (
                    <span className='form-control personal-detail-thin'>{firstName}</span>
                    )}
              </div>
            </div>

            {/* LAST NAME */}
            <div className='form-group text-start mb-2'>
              <label className='personal-detail'>Last name:</label>
              <div>
                {editModePersonal
                  ? (
                    <input type='text' className='form-control personal-detail-thin' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    )
                  : (
                    <span className='form-control personal-detail-thin'>{lastName}</span>
                    )}
              </div>
            </div>

            {/* DATE OF BIRTH */}
            <div className='form-group text-start mb-2'>
              <label className='personal-detail'>Date of birth:</label>
              <div>
                {editModePersonal
                  ? (
                    <input type='date' className='form-control personal-detail-thin' value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                    )
                  : (
                      (dateOfBirth === ''
                        ? (<span className='form-control personal-detail-thin'>mm/dd/yyyy</span>)
                        : (<span className='form-control personal-detail-thin'>{new Date(dateOfBirth).toLocaleDateString()}</span>))

                    )}
              </div>
            </div>

            {/* Date Joined */}
            <div className='form-group text-start mb-2'>
              <label className='personal-detail'>Date Joined:</label>
              <div>
                <span className='form-control personal-detail-thin'>
                  {new Date(dateJoined).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <hr className='my-4' />

          {/* contact row */}
          <div className='row mb-3'>

            {/* error message */}
            {successMessageContactInfo && !errorMessageContactInfo && (
              <div className='alert alert-success' style={{ width: '100%' }}>
                {successMessageContactInfo}
              </div>
            )}
            {errorMessageContactInfo && !successMessageContactInfo && (
              <div className='alert alert-danger' style={{ width: '100%' }}>
                {errorMessageContactInfo}
              </div>
            )}

            <div className='row'>
              <div className='col'>
                <h6 className='mb-2 text-start personal-contact'>Contact</h6>
              </div>
              <div className='col text-end'>
                {!editModeContact
                  ? (
                    <a href='#' className='ml-1 edit-link' onClick={() => setEditModeContact(true)}>Edit</a>
                    )
                  : (
                    <>
                      <a href='#' className='ml-1 cancel-link' onClick={handleCancelContact}>Cancel</a>
                      <a href='#' className='ml-1 save-link' onClick={handleSaveContact}>Save</a>
                    </>
                    )}
              </div>
            </div>

            {/* EMAIL */}
            <div className='form-group text-start mb-2'>
              <label className='personal-detail'>Email:</label>
              <div>
                {editModeContact
                  ? (
                    <input type='email' className='form-control personal-detail-thin' value={email} onChange={(e) => setEmail(e.target.value)} />
                    )
                  : (
                    <span className='form-control personal-detail-thin'>{email}</span>
                    )}
              </div>
            </div>

            {/* PHONENUMBER */}
            <div className='form-group text-start mb-2'>
              <label className='personal-detail'>Phone number:</label>
              <div>
                {editModeContact
                  ? (
                    <input type='tel' className='form-control personal-detail-thin' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    )
                  : (
                    <span className='form-control personal-detail-thin'>{phoneNumber}</span>
                    )}
              </div>
            </div>

          </div>
        </div>
      </div>

    </>
  )
}
export default AccountGeneralTab
