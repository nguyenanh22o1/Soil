import React from 'react'
import tomatoes from '../../../assets/images/tomatoes.jpg'
import vegies from '../../../assets/images/veges.jpg'

const InfoSection = () => {
  return (
    <div className='container-fluid bottom-margin homepage'>
      <div className='row background-box d-flex justify-content-center'>
        <div className='col-md-12 p-3' style={{ backgroundColor: '#D9EBDD' }}>
          <div className='row custom-margin'>
            <div className='col-md-3 left-box d-flex align-items-center justify-content-center'>
              <img src={tomatoes} alt='Tomatoes' className='tomatoes-img' />
            </div>
            <div className='col-md-3 left-box d-flex align-items-center justify-content-center'>
              <img src={vegies} alt='Vegies' className='vegies-img' />
            </div>
            <div className='col-md-6 right-box text-start'>
              <h1>What Makes Food <span className='bold-highlight-organic'>Organic</span>?</h1>
              <p>Organic food stands for natural integrity—grown without synthetic pesticides or genetically modified organisms (GMOs), fostering soil and ecosystem health. It's the purest form of nourishment, promising environmental sustainability and optimal wellness. With <span className='bold-highlight-soil'>soil</span>, you’re choosing a cleaner plate and a greener world.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoSection
