import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import './article.scss'
import Footer from '../components/Footer'

const Article = () => {
  const [isLike, setIsLike] = useState(false)

  const likeBTClick = () => {
    setIsLike(!isLike)
  }
  return (
    <>
      <Navbar />
      <div className='article'>
        <div className="leftSide">
          <div className="container">
            <div className="likeBT" onClick={() => likeBTClick()}>
              {!isLike ? <img src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png" alt="" />
                : <img src="https://cdn-icons-png.flaticon.com/512/1550/1550594.png" alt="" />
              }
              <span>收藏</span>
            </div>
          </div>

        </div>
        <div className="mainContent">
          <div className="wrapper">
            <div className="title">長灘（Long Beach）5 家燈光美、氣氛佳的漂亮餐廳，其中一間「巴黎風情」滿滿！還能享用到特色甜點？</div>
            <div className="subTitle">BARBRA W.MAR 29, 2023</div>
            <div className="content">大家平常有去探索一下長灘地區的餐廳嗎？我個人時常在長灘附近閒晃，知道這裡漂亮的餐廳還真不少呢！所以在這裡找地方吃
              飯的時候，也真的十分容易選擇困難症發作！今</div>
            <div className='articleInfo'>
              <div className="like">
                <img src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png" alt="" />
                101
              </div>
              <div className="articleLabels">
                <span>#美食餐廳</span>
                <span>#Long Beach</span>
              </div>
            </div>
            <div className="authInfo">
              <div className="left">
                <div className='photo' style={{ backgroundImage: `url("` + 'https://i.imgur.com/wcXhyMA.png' + `")` }}></div>
                IG: barbra_0407<br />FB: 王巴拉
              </div>
              <div className="right">
                <div className="name">BARBRA W.MAR</div>
                <div className="description">Magazine 内容編輯，懶人代表擔當</div>
                <div className="selfLabel">
                  <span>#處女座</span>
                  <span>#潔癖達人</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer/>
    </>
  )
}

export default Article