import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import ProductsGrid from '../../components/ProductsGrid/ProductsGrid'

const AllProductsPage = () => {
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
              <h1>All <span className='bold-highlight-specials'>Products</span></h1>
            </div>
            {/* Product Rows */}
            <ProductsGrid filterType='all' />
          </div>
        </div>
      </div>

    </>
  )
}

export default AllProductsPage
