import './App.css'
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/LoginPage/LoginPage'
import SignupPage from '../pages/SignUpPage/SignUpPage'
import ProfilePage from '../pages/ProfilePage/ProfilePage'
import HomePage from '../pages/HomePage/HomePage'
import SpecialsPage from '../pages/SpecialsPage/SpecialsPage'
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage'
import Footer from '../components/Footer/Footer'
import DietPlanner from '../pages/DietPlanner/DietPlanner'
import ProductPage from '../pages/ProductPage/ProductPage'
import AllProductsPage from '../pages/AllProductsPage/AllProductsPage'
import { CartProvider } from '../components/ShoppingCart/CartContext'

function App () {
  return (
    <div className='App content'>
      <CartProvider>
        <Router>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/specials' element={<SpecialsPage />} />
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='/product/:productId' element={<ProductPage />} />
            <Route path='/products' element={<AllProductsPage />} />
            <Route path='/diet-planner' element={<DietPlanner />} />
            <Route path='/' element={<HomePage />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </div>
  )
}

export default App
