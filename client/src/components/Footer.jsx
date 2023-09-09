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
            <Link to="https://sarahah.top/u/giraffe71?Lang=en"><li>匿名留言</li></Link>
            <Link to="https://instagram.com/giraffe_71_cy?igshid=ZGUzMzM3NWJiOQ=="><li>聯絡開發者</li></Link>
          </ul>
        </div>
        <div className="tag">© MagaFine Limited</div>
      </div>
    </div>
  )
}

export default Footer