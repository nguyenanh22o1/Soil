import React from 'react'
import food1 from '../../../assets/images/food.jpg'
import food2 from '../../../assets/images/food2.jpg'

const SecretToEatingSection = () => {
  return (
    <div className='container-fluid bottom-margin homepage'>
      <div className='row background-box d-flex justify-content-center'>
        <div className='col-md-12 p-3' style={{ backgroundColor: '#FFF6EA' }}>
          <div className='row custom-margin'>
            <div className='col-md-6 right-box text-end'>
              <h1>Ever Wonder What the <span style={{ color: '#0009E3' }}>Secret</span> to <span style={{ fontWeight: 'bold', color: '#B53006' }}>Balanced</span> Eating is?</h1>
              <p>
                A nutritious diet is less about strict limitations and more about making smart yet satisfying choices.
                Dive into our diet planner for a mix of colorful fruits, hearty whole grains, and lean proteins.
                Keep water by your side, savor each bite, and ease up on processed foods.
                With our easy steps toward better habits, you're not just eating well—you're paving the road to vibrant health.
                <br /> Let's journey towards wellness, together!
              </p>
            </div>
            <div className='col-md-3 left-box d-flex align-items-center justify-content-center'>
              <img src={food1} alt='Tomatoes' className='tomatoes-img' />
            </div>
            <div className='col-md-3 left-box d-flex align-items-center justify-content-center'>
              <img src={food2} alt='Vegies' className='vegies-img' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecretToEatingSection
