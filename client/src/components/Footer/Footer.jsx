import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer () {
  return (
    <footer className='footer mt-auto py-3 bg-dark text-white'>
      <div className='container text-center'>
        <div className='row'>
          {/* About Section */}
          <div className='col-md-4'>
            <h5>About Soil</h5>
            <p>
              Nourishing communities with organic produce straight
              from our farms to your doorstep.
            </p>
          </div>

          {/* Navigation */}
          <div className='col-md-4'>
            <h5>Navigation</h5>
            <ul className='list-unstyled'>
              <li><Link to='/products'>Products</Link></li>
              <li><Link to='/specials'>Week's Specials</Link></li>
              <li><Link to='/diet-planner'>Diet Planner</Link></li>
            </ul>
          </div>

          {/* Social Media Links */}
          {/* The links dont go anywhere heh */}
          <div className='col-md-4'>
            <h5>Follow Us</h5>
            <ul className='list-unstyled'>
              <li><a href='#'>Facebook</a></li>
              <li><a href='#'>Instagram</a></li>
              <li><a href='#'>Twitter</a></li>
            </ul>
          </div>
        </div>

        <div className='border-top pt-3'>
          <p>&copy; {new Date().getFullYear()} Soil. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
