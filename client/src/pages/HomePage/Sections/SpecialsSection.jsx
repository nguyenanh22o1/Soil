import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../../../components/ProductCard/ProductCard'
import SpecialsImage from '../../../assets/images/sale.png'

const SpecialsSection = () => {
  const navigate = useNavigate()
  const [specials, setSpecials] = useState([])

  useEffect(() => {
    const fetchSpecials = async () => {
      try {
        const response = await axios.get('http://localhost:8000/v1/products/featured-specials')
        setSpecials(response.data)
      } catch (error) {
        console.error('Error fetching featured specials:', error)
      }
    }

    fetchSpecials()
  }, [])

  const handleViewSpecialsClick = () => {
    navigate('/specials')
  }

  return (
    <div className='container-fluid bottom-margin'>
      <div className='row'>
        <div className='col-12 p3' style={{ backgroundColor: '#FFF6EA' }}>
          <div className='row justify-content-center align-items-center p-4'>
            <h1>Featured <span className='bold-highlight-specials'>Specials</span></h1>
          </div>
          <div className='row justify-content-center align-items-center custom-margin'>
            {specials.map((product) => (
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
              <button onClick={handleViewSpecialsClick} className='btn btn-custom w-100 d-flex align-items-center justify-content-center text-start p-2 shadow'>
                <img src={SpecialsImage} alt='Specials Icon' className='button-icon me-2' />
                <span>View All Week's Specials Here</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpecialsSection
