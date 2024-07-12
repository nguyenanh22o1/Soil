/* global localStorage */
import React, { useState, useContext, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { PersonCircle, Cart3 } from 'react-bootstrap-icons'
import './NavigationBar.css'
import CartSidebar from '../ShoppingCart/CartSidebar'
import CartContext from '../../components/ShoppingCart/CartContext'
import Overlay from '../ShoppingCart/Overlay'
import { useNavigate } from 'react-router-dom'

const NavigationBar = () => {
  const navigate = useNavigate()

  const [showDropdown, setShowDropDown] = useState(false)
  // Retrieve the user from local storage
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))

  const [showCartSidebar, setShowCartSidebar] = useState(false)

  // State to track closing animation
  const [isClosing, setIsClosing] = useState(false)

  const [shadow, setShadow] = useState(false)

  // Retrieve cart items from context
  const cartContext = useContext(CartContext)
  // Check if items is undefined default to an empty array
  const items = cartContext?.items || []

  const totalQuantity = items.reduce((total, item) => total + item.amount, 0)

  // Logic to toggle the cart sidebar
  const toggleCartSidebar = () => {
    setShowCartSidebar(prev => !prev)

    // If showing the sidebar, disable x overflow on the body (remove horizontal scroll bar)
    if (!showCartSidebar) {
      document.body.style.overflowX = 'hidden'
    }
  }

  // Function to handle the closing sidebar animation
  const closeCartSidebar = () => {
    setShowCartSidebar(false)
    // Reset the overflow when the sidebar is closed
    document.body.style.overflowX = ''
  }

  const handleDropdown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDropDown(!showDropdown)
  }

  useEffect(() => {
    const handleScroll = () => {
      // When scroll is more than 10px, set shadow to true
      setShadow(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  const navigateToMealPlanner = () => {
    navigate('/diet-planner')
    window.location.reload()
  }

  // Refactor to make it responsive
  return (
    <header className={`custom-navbar ${shadow ? 'scrolled' : ''}`}>
      <a href='/' className='brand-name'>soil</a>
      <nav className='nav-links'>
        <ul>
          {/* <li><a href='/about'>About Us</a></li> */}
          <li><a href='/products'>Products</a></li>
          <li><a href='/specials'>Week's Specials</a></li>
          <li><a
            href='/diet-planner'
            onClick={(e) => {
              e.preventDefault()

              if (loggedInUser) {
                navigateToMealPlanner()
              } else {
                navigate('/login')
              }
            }}
              >Diet Planner
          </a>
          </li>
          {/* <li><a href='/recipes'>Recipes</a></li> */}
        </ul>
      </nav>
      <button className='cart-button' onClick={toggleCartSidebar}>
        <Cart3 />
        {totalQuantity > 0 && <span className='cart-item-count'>{totalQuantity}</span>}
      </button>
      {showCartSidebar && <Overlay show={showCartSidebar} onClick={closeCartSidebar} />}
      <div className={`cart-dropdown ${showCartSidebar ? 'cart-sidebar-visible' : ''} ${isClosing ? 'cart-sidebar-closing' : ''}`}>
        <CartSidebar />
      </div>

      <div className='login-signup'>
        {loggedInUser ? (
          <>
            <button className='user-name-button' onClick={handleDropdown}>
              <PersonCircle className='person-logo' />
              Hi, {loggedInUser.firstName} {loggedInUser.lastName}
            </button>
            {showDropdown && (
              <div className='dropdown-menu'>
                <a href='/profile' className='dropdown-item'>Your Profile</a>
                <a
                  href='#' className='dropdown-item' onClick={() => {
                    localStorage.removeItem('loggedInUser')
                    setShowDropDown(false)
                  }}
                >Sign out
                </a>
              </div>
            )}
          </>
          // If there's a logged-in user, show their name
        ) : (
          // Otherwise, show the login/sign up link
          <a href='/signup' className='login-signup-link'>
            <PersonCircle className='person-logo' />
            Login/Sign Up
          </a>
        )}
      </div>
    </header>
  )
}

export default NavigationBar
