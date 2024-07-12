import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductsGrid from '../../components/ProductsGrid/ProductsGrid'
import './SpecialsPage.css'

const SpecialsPage = () => {
  return (
    <>
      <NavigationBar />
      <div className='backgroundRectangle' />
      {/* All Specials */}
      <div className='container-fluid bottom-margin'>
        <div className='row'>
          {/* Background Container */}
          <div className='col-12 p3'>
            <div className='row justify-content-center align-items-center p-4'>
              <h1>This Week's <span className='bold-highlight-specials'>Specials</span></h1>
            </div>
            {/* Product Rows */}
            <ProductsGrid filterType='specials' />
          </div>
        </div>
      </div>

    </>
  )
}

export default SpecialsPage
