import React, { useContext, useState } from 'react'
import './login.scss'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { LoginContext } from '../context/LoginContext'
import { login_failure, login_success, start_login } from '../constants/actionTypes'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const registerSuccess = useLocation()//接我們register navgate過來的res
  const navigate = useNavigate()
  const { loading, error, dispatch } = useContext(LoginContext)
  const [loginData, setLoginData] = useState({
    account: undefined,
    password: undefined
  })
  const [errorMessage, setErrorMessage] = useState("")
  const handleChange = (e) => {
    setLoginData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleClick = async (e) => {
    e.preventDefault()
    dispatch({ type: start_login })
    //loading，讓按鈕變成loading，不讓使用者重複點擊，等待後端回傳資料，再讓使用者點擊，不然會有bug，
    //因為我們是用context，所以不用setState(非同步的)，直接dispatch，讓reducer(同步)去改變state，這樣就不會有bug。
    try {
      const res = await axios.post("/auth/login", loginData)
      dispatch({ type: login_success, payload: res.data.userDetails })
      //console.log(res)
      navigate("/")
    } catch (error) {
      setErrorMessage(error.response.data.message)
      dispatch({ type: login_failure, payload: error.response.data })
    }
  }

  return (
    <>
      <div className='login' style={{ minHeight: '100vh' }}>
        <Navbar />
        <div className="container">
          <div className="title">登入</div>
          <div className="account">
            <span>帳號: </span>
            <input type="text" placeholder='名稱/Email' id='account' onChange={handleChange} />
          </div>
          <div className="password">
            <span>密碼: </span>
            <input type="password" id='password' onChange={handleChange} />
          </div>
          <div className="login" id='loginPageLogin'>
            <button className='loginBT' id='loginBT2' onClick={handleClick}>LOGIN</button>
          </div>
          <p className="warning">{errorMessage && <span>*</span>}{errorMessage}</p>
        </div>
        <div className='bottom'>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Login