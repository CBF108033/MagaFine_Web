import React, { useContext, useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import './article.scss'
import Footer from '../components/Footer'
import { useLocation, useNavigate } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import axios from 'axios'
import parse from 'html-react-parser'
import { LoginContext } from '../context/LoginContext.js'
import { OptionsContext } from '../context/OptionsContext'
import { new_Options } from '../constants/actionTypes'

const Article = () => {
  const locationArticleUrl = useLocation()
  const articleId = locationArticleUrl.pathname.split("/")[2]
  // const { data, loading, error } = useFetch(`/articles/${articleId}`)
  const [data, setData] = useState(null)//文章資料
  const [articleLoading, setArticleLoading] = useState(true)//文章資料載入狀態
  const [authData, setAuthData] = useState([])
  const [isLike, setIsLike] = useState(false)
  const { user } = useContext(LoginContext)
  const isInitialMount = useRef(true);
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        console.log('first render')
        // 初次渲染時就抓取一次資料
        let response = await axios.get(`/articles/${articleId}`)
        setData(response.data)
      } else {
        // 根據特定條件重新渲染時才抓取資料
        let response = await axios.get(`/articles/${articleId}`)
        setData(response.data)
      }
    }
    fetchData()
  }, [isLike])

  useEffect(() => {
    const fetchData = async () => {
      const userData = await axios.get(`/users/find/${data.AuthorId}`)
      setAuthData(userData.data)
    }
    fetchData()
  }, [data])

  const likeBTClick = async () => {
    if (!user) return alert('請先登入')
    else {
      try {
        await axios.put(`/users/like/${user._id}/${articleId}`)
      } catch (err) {
        console.log(err)
      }
      setIsLike(!isLike)
    }
  }

  const { searchText, hashtag, type, category, dispatch } = useContext(OptionsContext)
  const linkTo = (e) => {
    const hashtag = e.target.innerText.split('#')[1]
    dispatch({ type: new_Options, payload: { inputText: "", hashtag: [hashtag], type: [], category: []} })
    navigate('/')
  }

  const handleUserClick = () => {
    navigate(`/user/${data.AuthorId}`)
  }
  return (
    <>
      <Navbar />
      <div className='article'>
        <div className="leftSide">
          <div className="container">
            <div className="likeBT" onClick={() => likeBTClick()}>
              {//console.log(data?.hearts)
                data?.hearts?.includes(user?._id) ? <img src="https://cdn-icons-png.flaticon.com/512/1550/1550594.png" alt="" />
                  : <img src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png" alt="" />
              }
              {/* {!isLike ? <img src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png" alt="" />
                : <img src="https://cdn-icons-png.flaticon.com/512/1550/1550594.png" alt="" />
              } */}
              <span>收藏</span>
            </div>
          </div>

        </div>
        <div className="mainContent">
          <div className="wrapper">
            <div className="title">{data?.title}</div>
            <div className="subTitle" onClick={handleUserClick}>{authData.userName}&nbsp;&nbsp;&nbsp;{data?.createdAt?.slice(0, 10)}</div>
            <div className="content">{parse(data?.content || "")}</div>
            <div className='articleInfo'>
              <div className="like">
                <img src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png" alt="" />
                {data?.hearts?.length}
              </div>
              <div className="articleLabels">
                {data?.length !== 0 && data?.hashtags.map((hashtag, index) => {
                  return (
                    <span key={index} onClick={linkTo}>#{hashtag}</span>
                  )
                })}
              </div>
            </div>
            <div className="authInfo">
              <div className="left">
                <div className='photo' style={{ backgroundImage: `url("` + (authData.photo === "" ? 'https://i.imgur.com/QzIXtAa_d.webp?maxwidth=760&fidelity=grand' : authData.photo) + `")` }}></div>{/*'https://i.imgur.com/wcXhyMA.png'*/}
                IG: NOBody_01<br />FB: NOBody
              </div>
              <div className="right">
                <div className="name" onClick={handleUserClick}>{authData.userName}</div>
                <div className="description">{authData.description}</div>
                <div className="selfLabel">
                  {authData.length !== 0 && authData.personalizedHashtags.map((hashtag, index) => {
                    return (
                      <span key={index}>#{hashtag}</span>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}

export default Article