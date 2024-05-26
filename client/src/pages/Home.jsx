import React, { useEffect, useLayoutEffect, useState } from 'react'
//import './home.scss'
import Navbar from '../components/Navbar'
import Searchbar from '../components/Searchbar'
import Posts from '../components/Posts'
import Footer from '../components/Footer'
import './home.scss'
import { API_URL_AWS, TAB_KEY, ENVIRONMENT } from '../constants/actionTypes'
import axios from 'axios'

const Home = () => {
  //回首頁時到頁面最頂部
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  });
  const [isOpenSearch, setIsOpenSearch] = useState(false)
  localStorage.removeItem(TAB_KEY);

  /**
   * 取得client ip
   * 
   * @returns {string} ip
   */
  const info = async () => {
    const info = await axios.get(API_URL_AWS + '/getip')
    return info['data']['ip'];
  }

  useEffect(() => {
    let ip = info();
    if (ip === '127.0.0.1') {
      ENVIRONMENT.status = 'development';
    }else{
      ENVIRONMENT.status = 'production';
    }
  }, [])

  return (
    <div className='home'>
      <div className="top">
      <Navbar/>
      <Searchbar isOpen={(i) => { setIsOpenSearch(i) }}/>{/*//isOpen設定讓Searchbar可以控制Posts的isMask狀態*/}
      <Posts isMask={isOpenSearch}/>
      </div>
      <div className="bottom">
      <Footer/>
      </div>
    </div>
  )
}

export default Home