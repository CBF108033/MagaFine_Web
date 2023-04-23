import React from 'react'
import './login.scss'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Login = () => {
  return (
    <>
      <div className='login' style={{ minHeight: '100vh' }}>
        <Navbar/>
        <div className="container">
          <div className="title">登入</div>
          <div className="account">
            <span>帳號: </span>
            <input type="text" placeholder='名稱/Email' />
          </div>
          <div className="password">
            <span>密碼: </span>
            <input type="password"/>
          </div>
          <div className="login" id='loginPageLogin'>
            <button className='loginBT' id='loginBT2'>LOGIN</button>
          </div>
          <p className="warning"><span>*</span> 帳號或密碼錯誤</p>
        </div>
        <div className='bottom'>
          <Footer/>
        </div>
      </div>
    </>
  )
}

export default Login