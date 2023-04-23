import React from 'react'
import './register.scss'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Register = () => {
  return (
    <>
      <div className='register' style={{ minHeight: '100vh' }}>
        <Navbar />
        <div className="container">
          <div className="title">註冊</div>
          <div className="account">
            
            <span><span className='require'>*</span>名稱: </span>
            <input type="text" placeholder='Fiona' />
          </div>
          <div className="email">
            
            <span><span className='require'>*</span>Email: </span>
            <input type="text" placeholder='fiona@gmail.com' />
          </div>
          <div className="password">
            
            <span><span className='require'>*</span>密碼: </span>
            <input type="password" />
          </div>
          <div className="comfirmPassword">
            
            <span><span className='require'>*</span>確認密碼: </span>
            <input type="password" />
          </div>
          <div className="uploadPhoto">
            <span>照片上傳:</span>
            <button>上傳檔案</button>
            <span>photo.png</span>
          </div>
          <div className="discrptionMyself">
            <span>對自己的描述:</span>
            <textarea type="area" placeholder='喜歡跳出舒適圈的背包客..'/>
            <p style={{ gridColumnStart: 2 }}><span className="require">*</span>50字以內</p>
          </div>
          <div className="labelMyself">
            <span>個性化標籤:</span>
            <input type="text" placeholder='#假文青#科技#Love科技#Love' />
            <p style={{ gridColumnStart: 2}}><span className="require">*</span>以井字號作為分割(最多5個標籤)</p>
          </div>
          <div className="registerPageSend">
            <button className='registerSendBT'>送出</button>
          </div>
          <p className="warning"><span className='require'>*</span> 帳號格式錯誤</p>
        </div>
        <div className='bottom'>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Register