import React, { useContext, useState } from 'react'
import './letterLogin.scss'
import { API_URL_AWS, login_failure, login_success, start_login } from '../constants/actionTypes'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LetterLoginContext } from '../context/LetterLoginContext'

const LetterLogin = () => {
  // console.log(registerSuccess?.state||"No");
  const navigate = useNavigate()
  const { loading, error, dispatch } = useContext(LetterLoginContext)
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
      const res = await axios.post(API_URL_AWS + "/auth/letterLogin", loginData)
      dispatch({ type: login_success, payload: res.data.userDetails })
      //console.log(res)
      navigate('/letter')
    } catch (error) {
      setErrorMessage(error.response?.data.message)
      dispatch({ type: login_failure, payload: error.response?.data })
    }
  }

  return (
    <>
      <div className='letterLogin' style={{ minHeight: '100vh' }}>
        <div className="container" style={{ gridTemplateRows: errorMessage ? '1fr 1fr 1fr 1fr 1fr 4fr' : '1fr 1fr 1fr 1fr 4fr' }}>
          <div className="title">📭 My MailBox</div>
          <div className="account">
            <span>NAME: </span>
            <input type="text" placeholder='fiona' id='account' onChange={handleChange} />
          </div>
          <div className="password">
            <span>KEY: </span>
            <input type="text" placeholder='4 number' id='password' onChange={handleChange} />
          </div>
          <div className="login" id='loginPageLogin'>
            <button className='loginBT' id='loginBT2' onClick={handleClick}>Unlock 🔓</button>
          </div>
          <p className="warning" style={{ display: errorMessage ? 'block' : 'none'}}>{errorMessage && <span>*</span>}{errorMessage}</p>
          <div className="noAccount">
            <span style={{ marginBottom: '10px' }}>❗❗ TIP</span><br/>
            <span>1. The NAME is your name on Instagram (p.s. Not your account)</span>
            <span style={{ marginBottom: '10px' }}>* Case insensitive</span>
            <span>2. The KEY is the time of the first message in our Instagram chat (please scroll to top to get the sending time of the first msg!)</span>
            <span>Based on Vancouver time(GMT-7)</span>
            <span>eg. 8:09 is 0809, 00:15 is 0015</span>
            <span><a target='_blank' href='https://i.imgur.com/8EUwyJJ.jpeg'>example</a></span>
          </div>
        </div>
      </div>
    </>
  )
}

export default LetterLogin