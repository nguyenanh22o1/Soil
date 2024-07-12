import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../../../components/ProductCard/ProductCard'
import ProductsImage from '../../../assets/images/browse.png'

const FeaturedProductsSection = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/v1/products/featured')
        setProducts(response.data)
      } catch (error) {
        console.error('Error fetching featured products:', error)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const handleViewAllProductsClick = () => {
    navigate('/products')
  }

  return (
    <div className='container-fluid bottom-margin'>
      <div className='row'>
        <div className='col-12 p3' style={{ backgroundColor: '#FFF6EA' }}>
          <div className='row justify-content-center align-items-center p-3'>
            <h1>Featured <span className='bold-highlight-products'>Products</span></h1>
          </div>
          <div className='row justify-content-center align-items-center custom-margin'>
            {products.map((product) => (
              <div key={product.id} className='col-12 col-md d-flex justify-content-center align-items-center m-1'>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  cultivation={product.cultivation}
                  salePrice={product.salePrice}
                  originalPrice={product.originalPrice}
                  imageSrc={product.imageSrc}
                  category={product.category}
                  rating={product.rating}
                />
              </div>
            ))}
          </div>
          <div className='row justify-content-center p-3'>
            <div className='col-12 col-md-2 p1 m-1'>
              <button onClick={handleViewAllProductsClick} className='btn btn-custom w-100 d-flex align-items-center justify-content-center text-start p-2 shadow'>
                <img src={ProductsImage} alt='Browse Icon' className='button-icon me-2' />
                <span>View All Products Here</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedProductsSection
