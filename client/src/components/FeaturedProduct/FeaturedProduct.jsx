import React, { useState, useEffect } from 'react'
import ProductCard from '../ProductCard/ProductCard'
import './FeaturedProduct.css'

// Component to display a randomly selected product with its details and cultivation
const FeaturedProduct = () => {
  const [featuredProduct, setFeaturedProduct] = useState(null)

  // Effeect to fetch products from localStorage and slect on randomly
  useEffect(() => {
    const productsString = localStorage.getItem('products')
    const products = productsString ? JSON.parse(productsString) : []
    if (products.length > 0) {
      // Select a random product
      const randomProduct = products[Math.floor(Math.random() * products.length)]
      setFeaturedProduct(randomProduct)
    }
  }, [])

  if (!featuredProduct) {
    // loading state if no product has been set
    return <div>Loading...</div>
  }

  // render featured product
  return (
    <div className='container my-4 cultivation-box'>
      <div className='row justify-content-center'>
        <div className='col-lg-10'>
          <div className='row'>
            <div className='col-md-6'>
              <ProductCard
                id={featuredProduct.id}
                name={featuredProduct.name}
                description={featuredProduct.description}
                cultivation={featuredProduct.cultivation}
                salePrice={featuredProduct.salePrice}
                originalPrice={featuredProduct.originalPrice}
                imageSrc={featuredProduct.imageSrc}
                category={featuredProduct.category}
                rating={featuredProduct.rating}
              />
            </div>
            <div className='col-md-6'>
              <div className='cultivation-info'>
                <h3>How to Grow</h3>
                <p>{featuredProduct.cultivation.replace(/\\n/g, ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedProduct
