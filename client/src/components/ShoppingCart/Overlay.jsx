// Page overlay dimmer when shopping cart is out
import React from 'react'
import './Overlay.css'

const Overlay = ({ show, onClick }) => {
  if (!show) return null
  return <div className='overlay' onClick={onClick} />
}

export default Overlay
