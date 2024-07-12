import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCard from '../ProductCard/ProductCard'
import './ProductsGrid.css'

// Sort options for the product grid
const SortOptions = {
  PRICE_LOW_HIGH: 'Price Low to High',
  PRICE_HIGH_LOW: 'Price High to Low',
  SPECIALS: 'Specials',
  A_Z: 'A-Z',
  Z_A: 'Z-A'
}

const ProductsGrid = ({ filterType }) => {
  const [products, setProducts] = useState([])
  const [sortOption, setSortOption] = useState(SortOptions.PRICE_LOW_HIGH)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response
        if (filterType === 'specials') {
          response = await axios.get('http://localhost:8000/v1/products/specials')
        } else {
          response = await axios.get('http://localhost:8000/v1/products')
        }
        const fetchedProducts = response.data

        // Sorting filters
        fetchedProducts.sort((a, b) => {
          switch (sortOption) {
            case SortOptions.PRICE_LOW_HIGH:
              return parseFloat(a.salePrice) - parseFloat(b.salePrice)
            case SortOptions.PRICE_HIGH_LOW:
              return parseFloat(b.salePrice) - parseFloat(a.salePrice)
            case SortOptions.SPECIALS:
              return (a.salePrice !== a.originalPrice) ? 1 : -1
            case SortOptions.A_Z:
              return a.name.localeCompare(b.name)
            case SortOptions.Z_A:
              return b.name.localeCompare(a.name)
            default:
              return 0
          }
        })

        // Update product state with filtered and sorted products
        setProducts(fetchedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [filterType, sortOption])

  const handleSelectSortOption = (eventKey) => {
    setSortOption(eventKey)
  }

  return (
    <div className='container-fluid bottom-margin'>
      <div className='sorting-buttons text-center mb-3'>
        {Object.entries(SortOptions).map(([key, option]) => (
          <button
            key={key}
            className={`btn btn-outline-primary m-1 ${sortOption === option ? 'active' : ''}`}
            onClick={() => handleSelectSortOption(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className='row custom-grid-margin'>
        {products.map((product, index) => (
          <div key={index} className='col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center p-2'>
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
    </div>
  )
}

export default ProductsGrid
