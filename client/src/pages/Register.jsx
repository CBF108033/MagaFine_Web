import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './register.scss'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()

  const [error, setError] = useState("");
  const [registerData, setRegisterData] = useState({
    userName: undefined,
    email: undefined,
    password: undefined,
    photo: undefined,
    description: undefined,
    personalizedHashtags: undefined
  })
  const [checkPassword, setCheckPassword] = useState({
    checkPwd: undefined,
  })

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      if(!error){
        const res = await axios.post("/auth/register", registerData)
        navigate("/login", res)
      }
    } catch (error) {
      setError(error.response.data.message)
    }
  }
  
  useEffect(() => {
    if (registerData.password !== checkPassword.checkPwd) {
      setError("密碼不一致")
    } else {
      setError("")
    }
  }, [checkPassword, registerData])

  const handleCheckPassword = (e) => {
    setCheckPassword(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }
  const handleChange = (e) => {
    setRegisterData(prev => ({ ...prev, [e.target.id]: e.target.value, ['personalizedHashtags']: e.target.value.split('#').slice(1) }))
  }

  return (
    <>
      <div className='register' style={{ minHeight: '100vh' }}>
        <Navbar />
        <div className="container">
          <div className="title">註冊</div>
          <div className="account">
            
            <span><span className='require'>*</span>名稱: </span>
            <input type="text" placeholder='Fiona' id='userName' onChange={handleChange} 
              style={error === "此帳號或信箱已被註冊" ? { border: "2px solid red" } : { border: "1px solid grey" }}/>
          </div>
          <div className="email">
            
            <span><span className='require'>*</span>Email: </span>
            <input type="text" placeholder='fiona@gmail.com' id='email' onChange={handleChange} 
              style={error === "此帳號或信箱已被註冊" ? { border: "2px solid red" } : { border: "1px solid grey" }}/>
          </div>
          <div className="password">
            
            <span><span className='require'>*</span>密碼: </span>
            <input type="password" id='password' onChange={handleChange} 
              style={error === "密碼不一致" ? { border: "2px solid red" } : { border: "1px solid grey" }}/>
          </div>
          <div className="comfirmPassword">
            
            <span><span className='require'>*</span>確認密碼: </span>
            <input type="password" id='checkPwd' onChange={handleCheckPassword} 
              style={error === "密碼不一致" ? { border: "2px solid red" } : { border: "1px solid grey" }} />
          </div>
          <div className="uploadPhoto">
            <span>照片上傳:</span>
            <button>上傳檔案</button>
            <span>photo.png</span>
          </div>
          <div className="discrptionMyself">
            <span>對自己的描述:</span>
            <textarea type="area" placeholder='喜歡跳出舒適圈的背包客..' id='description' onChange={handleChange}/>
            <p style={{ gridColumnStart: 2 }}><span className="require">*</span>50字以內</p>
          </div>
          <div className="labelMyself">
            <span>個性化標籤:</span>
            <input type="text" placeholder='#假文青#科技#Love科技#Love' id='personalizedHashtags' onChange={handleChange}/>
            <p style={{ gridColumnStart: 2}}><span className="require">*</span>以井字號作為分割(最多5個標籤)</p>
          </div>
          <div className="registerPageSend">
            <button className='registerSendBT' onClick={handleClick}>送出</button>
          </div>
          <p className="warning">{error && <span className='require'>*</span>}{error}</p>
        </div>
        <div className='bottom'>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Register