import React, { useLayoutEffect, useState } from 'react'
//import './home.scss'
import Navbar from '../components/Navbar'
import Searchbar from '../components/Searchbar'
import Posts from '../components/Posts'
import Footer from '../components/Footer'
import './home.scss'
import { TAB_KEY } from '../constants/actionTypes'

const Home = () => {
  //回首頁時到頁面最頂部
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  });
  const [isOpenSearch, setIsOpenSearch] = useState(false)
  localStorage.removeItem(TAB_KEY);
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