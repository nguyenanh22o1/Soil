// https://codepen.io/alvaromontoro/post/recreating-ipad-pro-commercial-animation-with-css
// https://blog.hubspot.com/website/css-fade-in#text-transition

import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import RevisedSmallNaviBar from '../../components/SmallNaviBar/RevisedSmallNaviBar'
import HealthInfoPopUp from '../../components/HealthInfoPopUp/HealthInfoPopUp'
import FeaturedProduct from '../../components/FeaturedProduct/FeaturedProduct'
import BannerSection from './Sections/BannerSection'
import SpecialsSection from './Sections/SpecialsSection'
import FeaturedProductsSection from './Sections/FeaturedProductsSection'
import InfoSection from './Sections/InfoSection'
import DiscoverMoreSection from './Sections/DiscoverMoreSection'
import SecretToEatingSection from './Sections/SecretToEatingSection'
import CartSidebar from '../../components/ShoppingCart/CartSidebar'
import './HomePage.css'

const HomePage = () => {
  const [isOpenPersonalHealthForm, setisOpenPersonalHealthForm] = useState(true)
  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    if (loggedInUser) {
      // setUser(loggedInUser);
      // Check for the isSetupPersonalHealth
      setIsLogin(true)
      // if user already setup dont have to open
      setisOpenPersonalHealthForm(!loggedInUser.isSetupPersonalHealth)
    }
  }, [])

  // trigger popup
  return (
    <>
      <NavigationBar />
      <BannerSection />
      {/* trigger if user login */}
      {isOpenPersonalHealthForm && isLogin && (
        <HealthInfoPopUp
          onClose={() => setisOpenPersonalHealthForm(false)}
          onSave={() => setisOpenPersonalHealthForm(false)}
          message='First time? We need your health information.'

        />
      )}

      {/* SmallNaviBar Section */}
      <div className='bottom-margin'>
        <h1>Welcome To <span className='bold-highlight-soil'>soil</span></h1>
        {/* <SmallNaviBar /> */}
        <RevisedSmallNaviBar />
      </div>
      <InfoSection />
      <SpecialsSection />
      {/* <DiscoverMoreSection /> */}
      <FeaturedProductsSection />
      {/* <div className='container-fluid bottom-margin'>
        <div className='row justify-content-center p-3' style={{ backgroundColor: '#E8F3EA' }}>
          <h1>Featured Product</h1>
          <div className='col-12 p3'>
            <div className='row'>
              <FeaturedProduct />
            </div>
          </div>
        </div>
      </div> */}

      <SecretToEatingSection />
    </>
  )
}

export default HomePage
