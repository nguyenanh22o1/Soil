import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HealthInfoPopUp from '../HealthInfoPopUp/HealthInfoPopUp'
import { baseURL } from '../../utils/baseUrl'
import axios from 'axios'

const HealthDataTab = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [sex, setSex] = useState('')
  const [activityLevel, setActivityLevel] = useState('')
  const [dietaryPreferences, setDietaryPreferences] = useState([])
  const [healthGoals, setHealthGoals] = useState('')

  const [editMode, setEditMode] = useState(false)
  const [isOpenPersonalHealthForm, setIsOpenPersonalHealthForm] = useState(true)
  const [isLogin, setIsLogin] = useState(false)
  const [isFilledHealthForm, setIsFilledHealthForm] = useState(false)

  // error message triggers
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    setIsOpenPersonalHealthForm(!loggedInUser.isSetupPersonalHealth)
    const fetchUserData = async () => {
      // get data from loggedInUser

      if (loggedInUser) {
        setIsLogin(true)
        try {
          const response = await axios.get(`${baseURL}/user/${loggedInUser.id}`)

          const { data } = response
          setUser(data.user)
          setAge(data.user.age || '')
          setWeight(data.user.weight || '')
          setHeight(data.user.height || '')
          setSex(data.user.sex || '')
          setActivityLevel(data.user.activityLevel || '')
          setDietaryPreferences(data.user.dietaryPreferences || [])
          setHealthGoals(data.user.healthGoals || '')
          setIsOpenPersonalHealthForm(!data.user.isSetupPersonalHealth)
        } catch (error) {
          console.error('Error fetching user data:', error.response.data)
          // Handle error state
        }
      } else {
        navigate('/login')
      }
    }
    fetchUserData()
  }, [isFilledHealthForm])

  const handleSave = async () => {
    try {
      const response = await axios.put(`${baseURL}/user/${user.id}/health`, {
        age,
        weight,
        height,
        sex,
        activityLevel,
        dietaryPreferences,
        healthGoals
      })

      const { data } = response
      setUser(data.user)
      setEditMode(false)
      setErrorMessage('')
      setSuccessMessage(data.message)
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error)
        setSuccessMessage('')
      }
    }
  }

  // handle on click cancel
  const handleCancel = () => {
    setAge(user.age || '')
    setSex(user.sex || '')
    setWeight(user.weight || '')
    setHeight(user.height || '')
    setActivityLevel(user.activityLevel || '')
    setDietaryPreferences(user.dietaryPreferences || [])
    setHealthGoals(user.healthGoals || '')
    setEditMode(false)
  }

  // diet preferences options value and label
  const dietaryPreferencesOptions = [
    { value: 'VEGETARIAN', label: 'Vegetarian' },
    { value: 'VEGAN', label: 'Vegan' },
    { value: 'DAIRY_FREE', label: 'Dairy-free' },
    { value: 'PEANUT_FREE', label: 'Peanut-free' },
    { value: 'high-protein', label: 'High Protein' },
    { value: 'low-carb', label: 'Low Carbohydrate' }
  ]

  const formatDietaryPreferences = (preferences) => {
    // convert from jason to array
    // if (!Array.isArray(preferences)) {
    //   return ''; // Return an empty string if preferences is not an array
    // }
    // console.log(typeof preferences);
    if (typeof preferences === 'string') {
      preferences = JSON.parse(preferences)
    }
    return preferences.map((pref) => {
      const option = dietaryPreferencesOptions.find((opt) => opt.value === pref)
      return option ? option.label : ''
    })
      .join(', ')
  }

  return (
    <>
      {isOpenPersonalHealthForm && isLogin && (
        <HealthInfoPopUp
          onClose={() => setIsOpenPersonalHealthForm(false)}
          onSave={() => {
            setIsOpenPersonalHealthForm(false)
            setIsFilledHealthForm(true)
          }}
          message='Hey there! Would you mind updating your health information?'
          backButton='Back to home page'
        />
      )}

      <div className='tab-pane fade active show' id='account-health-info'>
        <div className='card-body'>

          <div className='col'>
            <h5 className='mb-4 text-start your-details'>Health data</h5>
          </div>

          {/* error message */}
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

          <div className='row'>
            <div className='col'>
              <h6 className='mb-3 text-start personal-contact'>Personal</h6>
            </div>
            <div className='col'>
              <div className='col text-end'>
                {!editMode
                  ? (
                    <a href='#' className='ml-3 edit-link' onClick={() => setEditMode(true)}>
                      Edit
                    </a>
                    )
                  : (
                    <>
                      <a href='#' className='ml-3 cancel-link' onClick={handleCancel}>
                        Cancel
                      </a>
                      <a href='#' className='ml-3 save-link' onClick={handleSave}>
                        Save
                      </a>
                    </>
                    )}
              </div>
            </div>

          </div>

          <div className='row'>
            <div className='col form-group text-start'>
              <label className='personal-detail'>Age:</label>
              <div>
                {editMode
                  ? (
                    <input
                      type='number'
                      className='form-control personal-detail-thin'
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                    )
                  : (
                    <span className='form-control personal-detail-thin'>{age} years old</span>
                    )}
              </div>

            </div>

            <div className='col form-group text-start mb-2'>
              <label className='personal-detail'>Sex:</label>
              {editMode
                ? (
                  <select
                    className='form-control personal-detail-thin'
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                  >
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                  </select>
                  )
                : (
                  <span className='form-control personal-detail-thin'>{sex}</span>
                  )}
            </div>
          </div>

          {/* HEALTH GOAL */}
          <div className='row'>
            <div className='col form-group text-start mb-2'>
              <label className='personal-detail'>Weight (kg):</label>
              {editMode
                ? (
                  <input
                    type='number'
                    className='form-control personal-detail-thin'
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                  )
                : (
                  <span className='form-control personal-detail-thin'>{weight} (kg)</span>
                  )}
            </div>

            <div className='col form-group text-start mb-2'>
              <label className='personal-detail'>Height (cm):</label>
              {editMode
                ? (
                  <input
                    type='number'
                    className='form-control personal-detail-thin'
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                  )
                : (
                  <span className='form-control personal-detail-thin'>{height} (cm)</span>
                  )}
            </div>
          </div>

          <div className='row'>
            <div className='col form-group text-start mb-2'>
              <label className='personal-detail'>BMI:</label>
              {weight && height
                ? (<span className='form-control personal-detail-thin'>{Math.round((weight / ((height / 100) * (height / 100))) * 1) / 1}</span>)
                : (<span className='form-control personal-detail-thin'>NaN</span>)}

            </div>

            <div className='col form-group text-start mb-2'>
              <label className='personal-detail'>Activity Level:</label>
              {editMode
                ? (
                  <select
                    className='form-control personal-detail-thin'
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                  >
                    <option value='sedentary'>Sedentary</option>
                    <option value='moderately-active'>Moderately Active</option>
                    <option value='very-active'>Very Active</option>
                  </select>
                  )
                : (
                  <span className='form-control personal-detail-thin'>{activityLevel}</span>
                  )}
            </div>
          </div>

          <div className='row'>
            <div className='form-group text-start mb-2'>
              <label className='personal-detail'>Dietary Preferences:</label>
              {editMode
                ? (
                  <select
                    className='form-control personal-detail-thin'
                    value={dietaryPreferences}
                    onChange={(e) =>
                      setDietaryPreferences(
                        Array.from(e.target.selectedOptions, (option) => option.value)
                      )}
                    multiple
                    title='Hold Ctrl (Windows) or Command (Mac) to select multiple options'
                  >
                    {dietaryPreferencesOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  )
                : (
                  <span className='form-control personal-detail-thin'>
                    {formatDietaryPreferences(dietaryPreferences)}
                  </span>
                  )}
            </div>
          </div>

          <div className='row'>
            <div className='form-group text-start mb-2'>
              <label className='personal-detail'>Health Goal:</label>
              {editMode
                ? (
                  <select
                    className='form-control personal-detail-thin'
                    value={healthGoals}
                    onChange={(e) => setHealthGoals(e.target.value)}
                  >
                    <option value='weight-loss'>Weight Loss</option>
                    <option value='gain-weight'>Gain Weight</option>
                    <option value='overall-health-improvement'>Overall Health Improvement</option>
                  </select>
                  )
                : (
                  <span className='form-control personal-detail-thin'>{healthGoals}</span>
                  )}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default HealthDataTab
