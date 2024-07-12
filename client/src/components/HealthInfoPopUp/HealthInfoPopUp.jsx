import React, { useState } from 'react'
import img from '../../assets/images/ihavenoideawhatthisis.jpeg'
import './HealthInfoPopUp.css'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { baseURL } from '../../utils/baseUrl'
import axios from 'axios'

const HealthInfoPopUp = ({ onClose, onSave, message, backButton }) => {
  const [age, setAge] = useState('')
  const [sex, setSex] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [activityLevel, setActivityLevel] = useState('')
  const [dietaryPreferences, setDietaryPreferences] = useState([])
  const [selectedDietary, setSelectedDietary] = useState([])
  const [healthGoals, setHealthGoals] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const dietaryPreferencesOptions = [
    { value: 'VEGETARIAN', label: 'Vegetarian' },
    { value: 'VEGAN', label: 'Vegan' },
    { value: 'DAIRY_FREE', label: 'Dairy-free' },
    { value: 'PEANUT_FREE', label: 'Peanut-free' },
    { value: 'high-protein', label: 'High Protein' },
    { value: 'low-carb', label: 'Low Carbohydrate' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    // validation
    if (!age || !sex || !weight || !height || !activityLevel || !healthGoals.length) {
      setErrorMessage('All fields are required except dietary preference')
      setSuccessMessage('')
      return
    }

    try {
      // find the logged-in user
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))

      // make the API request to save the health information
      const response = await axios.put(`${baseURL}/user/${loggedInUser.id}/health`, {
        age,
        sex,
        weight,
        height,
        activityLevel,
        dietaryPreferences,
        healthGoals,
        isSetupPersonalHealth: true
      })

      // health information saved successfully
      const { data } = response
      setErrorMessage('')
      setSuccessMessage(data.message)

      // update the loggedInUser object in local storage with isSetupPersonalHealth
      loggedInUser.isSetupPersonalHealth = true
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))

      // call the onSave callback after a short delay
      setTimeout(() => {
        onSave()
      }, 2000)
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error)
        setSuccessMessage('')
      }
    }
  }

  const navigateHome = () => {
    navigate('/')
  }

  return (
    <div className='popup-overlay'>
      <div className='row border rounded-5 p-3 bg-white shadow box-area'>
        {/* img */}
        <img
          src={img}
          alt='sunset'
          className='col-md-6 rounded-5 left-box mb-2 mt-2 object-fit-cover img-fluid'
        />
        {/* right box */}
        <div className='col-md-6 right-box'>
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
          <div className='row align-items-center'>

            {/* heading */}
            <div className='header-text mb-4 text-start'>
              <h2>Waa!</h2>
              <p>{message}</p>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit}>
              {/* age input */}
              <div className='input-group mb-3'>
                <input
                  type='number'
                  className='form-control form-control-lg bg-light fs-6'
                  placeholder='Age'
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />

                {/* sex */}
                <select
                  className='form-select form-select-lg bg-light fs-6'

                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                >
                  <option value=''>Sex</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                </select>
              </div>

              {/* weight */}
              <div className='input-group mb-3'>
                <input
                  type='number'
                  className='form-control form-control-lg bg-light fs-6'
                  placeholder='Weight (kg)'
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              {/* height */}
              <div className='input-group mb-3'>
                <input
                  type='number'
                  className='form-control form-control-lg bg-light fs-6'
                  placeholder='Height (cm)'
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>

              {/* dropbox activity level */}
              <div className='input-group mb-3'>
                <select
                  className='form-select form-select-lg bg-light fs-6'
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                >
                  <option value=''>Select Activity Level</option>
                  <option value='sedentary'>Sedentary</option>
                  <option value='moderately-active'>Moderately Active</option>
                  <option value='very-active'>Very Active</option>
                </select>
              </div>

              {/* dropbox dietaryPreferences */}
              <div className='mb-3'>
                <Select
                  className='fs-6 '
                  options={dietaryPreferencesOptions}
                  value={selectedDietary}
                  onChange={(selectedOptions) => {
                    const selectedLabels = selectedOptions.map((option) => option.value)
                    setSelectedDietary(selectedOptions)
                    setDietaryPreferences(selectedLabels)
                  }}
                  isMulti
                  placeholder='Select Dietary Preferences'
                  classNamePrefix='select'
                  menuPortalTarget={document.body}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      minWidth: '100%',
                      minHeight: '42px',
                      borderRadius: '7px',
                      textAlign: 'left',
                      background: '#F8F9FA'
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: 'black'

                    }),
                    menuPortal: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                      borderRadius: '7px'
                    }),
                    option: (provided) => ({
                      ...provided,
                      paddingTop: 0,
                      paddingBottom: 0

                    })
                  }}
                />
              </div>

              {/* drop box health goal */}
              <div className='input-group mb-3'>
                <select
                  className='form-select form-select-lg bg-light fs-6'

                  value={healthGoals}
                  onChange={(e) => setHealthGoals(e.target.value)}
                >
                  <option value=''>Select Health Goals</option>
                  <option value='weight-loss'>Weight Loss</option>
                  <option value='gain-weight'>Gain Weight</option>
                  <option value='overall-health-improvement'>Overall Health Improvement</option>
                </select>

              </div>

              {/* submit button */}
              <div className='input-group mb-2.1 mt-4'>
                <button
                  type='submit'
                  className='btn btn-lg btn-primary w-100 fs-6'
                  style={{
                    background: '#ca5b16',
                    borderColor: '#ca5b16',
                    transition: 'background-color 0.3s, box-shadow 0.3s',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#b65618'
                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ca5b16'
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  Submit
                </button>

              </div>

              {/* ------------ or------------ line */}
              <div style={{ width: '100%', height: '15px', borderBottom: '0.5px solid #8E8D8D', textAlign: 'center' }}>
                <span style={{ fontSize: '13px', color: '#8E8D8D', backgroundColor: 'white', padding: '0 5px' }}>
                  or
                </span>
              </div>

              {/* back button */}

              {(backButton
                ? <div className='input-group  mt-3'>
                  <button
                    type='submit'
                    className='btn btn-lg btn-primary w-100 fs-6'
                    style={{
                      background: '#E9E9E9',
                      borderColor: '#E9E9E9',
                      transition: 'background-color 0.3s, box-shadow 0.3s',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      color: '#b65618'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#E9E9E9'
                      e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#E9E9E9'
                      e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                    onClick={navigateHome}
                  >
                    {backButton}
                  </button>
                </div>
                : <div className='input-group  mt-3'>
                  <button
                    type='submit'
                    className='btn btn-lg btn-primary w-100 fs-6'
                    style={{
                      background: '#E9E9E9',
                      borderColor: '#E9E9E9',
                      transition: 'background-color 0.3s, box-shadow 0.3s',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      color: '#b65618'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#E9E9E9'
                      e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#E9E9E9'
                      e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                    onClick={onClose}
                  >
                    I'll do it later
                  </button>
                </div>
              )}

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthInfoPopUp
