import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import sale from '../../assets/images/sale.png'
import browse from '../../assets/images/browse.png'
import planner from '../../assets/images/planner.png'
import farm from '../../assets/images/farm.png'
import 'bootstrap/dist/css/bootstrap.min.css'
import './RevisedSmallNaviBar.css'

// Revised small navbar to use bootstrap for responsiveness
const RevisedSmallNaviBar = () => {
  const navigate = useNavigate()
  const handleViewSpecialsClick = () => {
    navigate('/specials')
  }

  const handleViewAllProductsClick = () => {
    navigate('/products')
  }

  const handleViewDietPlannerClick = () => {
    navigate('/diet-planner')
  }

  return (
    // Main Container
    <div className='container'>
      <div className='row justify-content-center small-navi-box rounded-3' style={{ backgroundColor: '#F9DFBC' }}>
        <div className='col-12'>
          <div className='row justify-content-center small-navi-box-2 align-items-center'>
            <div className='col-12 col-md-2 p-1 m-1'>
              <button onClick={handleViewSpecialsClick} className='btn btn-custom w-100 d-flex align-items-center justify-content-center text-start p-2 shadow'>
                <img src={sale} alt='Icon' className='button-icon me-2' />
                <span>Week's Specials</span>
              </button>
            </div>
            <div className='col-12 col-md-2 p-1 m-1'>
              <button onClick={handleViewAllProductsClick} className='btn btn-custom w-100 d-flex align-items-center justify-content-center text-start p-2 shadow'>
                <img src={browse} alt='Icon' className='button-icon me-2' />
                <span>Browse Products </span>
              </button>
            </div>
            <div className='col-12 col-md-2 p-1 m-1'>
              <button onClick={handleViewDietPlannerClick} className='btn btn-custom w-100 d-flex align-items-center justify-content-center text-start p-2 shadow'>
                <img src={planner} alt='Icon' className='button-icon me-2' />
                <span>Diet Planner</span>
              </button>
            </div>
            {/* <div className='col-12 col-md-2 p-1 m-1'>
              <button className='btn btn-custom w-100 d-flex align-items-center justify-content-center text-start p-2 shadow'>
                <img src={farm} alt='Icon' className='button-icon me-2' />
                <span>Browse Recipes</span>
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevisedSmallNaviBar
