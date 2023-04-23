import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import Posts from '../components/Posts'
import './user.scss'

const User = () => {
  const authInfo = useRef(null)
  const [isOver600, setIsOver600] = useState(true)

  //螢幕畫面縮放且寬度小等於600，作者欄位(.authInfo)在css會變100%且wrap，那麼這裡就將Post欄位也從60%變100%佔滿畫面。
  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 600) {
        console.log('小於600')
        setIsOver600(false)
      } else setIsOver600(true)
    });
    return (() => {
      window.removeEventListener('resize', () => {
        if (window.innerWidth <= 600) {
          console.log('小於600')
          setIsOver600(false)
        } else setIsOver600(true)
      });
    })

  }, [])

  return (
    <>
      <Navbar />
      <div className='user'>
        <div className="wrapper">
          <div className="authInfo" ref={authInfo}>
            <div className="container">
              <div className="row1">
                <div className='photo' style={{ backgroundImage: `url("` + 'https://i.imgur.com/wcXhyMA.png' + `")` }}></div>
                <div className="buttons">
                  <button>主頁</button>
                  <button>蒐藏</button>
                </div>
              </div>
              <div className="name">BARBRA W.MAR</div>
              <div className="description">Magazine 内容編輯，懶人代表擔當</div>
              <div className="contact">IG: barbra_0407<br />FB: 王巴拉</div>
              <div className="selfLabel">
                <span>#處女座</span>
                <span>#潔癖達人</span>
              </div>
            </div>
          </div>
          <Posts style={isOver600 ? { 'width': "60%" } : { 'width': "100%" }} userPost={{ justifyContent: 'flex-start' }} />
        </div>

      </div>
    </>
  )
}

export default User