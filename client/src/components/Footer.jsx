import React from 'react'
import './footer.scss'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer'>
      <div className="wrapper">
        <Link to="/" style={{ textDecoration: 'none',color:'black' }}>
          <div className="logo"><img src="https://i.imgur.com/WeHJy5e_d.webp?maxwidth=760&fidelity=grand" />MagaFine</div>
        </Link>
        <div className="info">
          <ul>
            <li>關注我們</li>
            <li>關於我們</li>
            <li>訂閱我們</li>
            <li>聯絡我們</li>
          </ul>
        </div>
        <div className="tag">© MagaFine Limited</div>
      </div>
    </div>
  )
}

export default Footer