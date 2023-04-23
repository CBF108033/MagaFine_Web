import React, { useLayoutEffect } from 'react'
//import './home.scss'
import Navbar from '../components/Navbar'
import Searchbar from '../components/Searchbar'
import Posts from '../components/Posts'
import Footer from '../components/Footer'
import './home.scss'

const Home = () => {
  //回首頁時到頁面最頂部
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  });
  return (
    <div className='home'>
      <div className="top">
      <Navbar/>
      <Searchbar/>
      <Posts/>
      </div>
      <div className="bottom">
      <Footer/>
      </div>
    </div>
  )
}

export default Home