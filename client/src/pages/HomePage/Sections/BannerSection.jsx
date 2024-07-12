import React from 'react'
import bannerImg from '../../../assets/images/sunset.png'
import rightSideImg from '../../../assets/images/papaya.jpg'

const BannerSection = () => {
  return (
    <div className='container-fluid bottom-margin p-0'>
      <div className='row background-box d-flex banner-margin'>
        <div className='col-md-8 p-0'>
          <img src={bannerImg} alt='Banner' className='img-fluid stretch-img banner-image' style={{ transform: 'scaleX(-1)', width: '100%' }} />
          <div className='animated-title'>
            <div className='text-top'>
              <div>From <span className='highlighted-text-top'>Earth</span></div>
            </div>
            <div className='text-bottom'>
              <div>To <span className='highlighted-text-bottom'>Hearth</span></div>
            </div>
          </div>
          <div className='fade-in-text'>
            <p>Nourish Naturally with SOIL’s Premium <span className='bold-highlight'>Organic</span></p>
            <p>Groceries Delivered to Your Door.</p>
          </div>
        </div>
        <div className='col-md-4 p-0'>
          <img src={rightSideImg} alt='Papaya' className='img-fluid stretch-img' style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  )
}

export default BannerSection
