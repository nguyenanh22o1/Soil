import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import img from '../../assets/images/sunset.png'
import 'bootstrap/dist/css/bootstrap.min.css'
import { baseURL } from '../../utils/baseUrl'
import './LoginPage.css'
import axios from 'axios'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${baseURL}/auth/login`, {
        email,
        password
      })

      const { data } = response
      const { id, isSetupPersonalHealth, firstName, lastName, following } = data.user // Include following here
      const loggedInUser = { id, isSetupPersonalHealth, firstName, lastName, following } // Include following here
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))

      setErrorMessage('')
      setSuccessMessage(data.message)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data
        setSuccessMessage('')
        setErrorMessage(errorData.error)
      }
    }
  }

  const handleSignupClick = () => {
    navigate('/signup')
  }

  return (
    <div className='container d-flex justify-content-center align-items-center min-vh-100'>
      <div className='row border rounded-5 p-3 bg-white shadow box-area'>
        {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}
        {successMessage && <div className='alert alert-success'>{successMessage}</div>}
        <img
          src={img}
          alt='sunset'
          className='col-md-6 rounded-5 left-box mb-2 mt-2 object-fit-cover img-fluid'
        />
        <div className='col-md-6 right-box'>
          <div className='row align-items-center'>
            <div className='header-text mb-4 text-start'>
              <h2>Hey there!</h2>
              <p>Missed us? We sure missed you.</p>
            </div>
            <form>
              <div className='input-group mb-3'>
                <input
                  type='text'
                  className='form-control form-control-lg bg-light fs-6'
                  placeholder='Email address'
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className='password-box'>
                <input
                  type='password'
                  className='form-control form-control-lg bg-light fs-6'
                  placeholder='Password'
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className='input-group mb-3 mt-4'>
                <button
                  type='button'
                  className='btn btn-lg btn-primary w-100 fs-6'
                  style={{
                    background: '#ca5b16',
                    borderColor: '#ca5b16',
                    transition: 'background-color 0.3s, box-shadow 0.3s',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                  onClick={handleLogin}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#b65618'
                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ca5b16'
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  Login
                </button>
              </div>
            </form>
            <div className='row text-start'>
              <small>
                Don't have an account? Sign up <span onClick={handleSignupClick} style={{ textDecoration: 'underline', color: '#ca5b16', cursor: 'pointer' }}>here</span>.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
