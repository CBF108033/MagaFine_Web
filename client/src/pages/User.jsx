import React, { useContext, useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import Posts from '../components/Posts'
import './user.scss'
import { useLocation } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import axios from 'axios'
import { LoginContext } from '../context/LoginContext'

const User = () => {
  const authInfo = useRef(null)
  const [isOver600, setIsOver600] = useState(true)
  const locationAuthUrl = useLocation()
  const authId = locationAuthUrl.pathname.split("/")[2]

  //螢幕畫面縮放且寬度小等於600，作者欄位(.authInfo)在css會變100%且wrap，那麼這裡就將Post欄位也從60%變100%佔滿畫面。
  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 600) {
        console.log('小於600')
        setIsOver600(false)
      } else setIsOver600(true)
    });
    return (() => {
      window.removeEventListener('resize', () => {
        if (window.innerWidth <= 600) {
          console.log('小於600')
          setIsOver600(false)
        } else setIsOver600(true)
      });
    })

  }, [])

  const { data, loading, error } = useFetch(`/users/find/${authId}`)//{}寫成[]會造成object is not iterable
  const { user, dispatch } = useContext(LoginContext);

  return (
    <>
      <Navbar />
      <div className='user'>
        <div className="wrapper">
          <div className="authInfo" ref={authInfo}>
            <div className="container">
              <div className="row1">
                <div className='photo' style={{ backgroundImage: `url("` + (data.photo === "" ? 'https://i.imgur.com/QzIXtAa_d.webp?maxwidth=760&fidelity=grand' : data.photo) + `")` }}></div>{/*'https://i.imgur.com/wcXhyMA.png'*/}
                {user?._id === authId && <div className="buttons">
                  <button>主頁</button>
                  <button>蒐藏</button>
                </div>
                }
              </div>
              <div className="name">{data.userName}</div>
              <div className="description">{data.description}</div>
              <div className="contact">IG:  <br />FB: NOBody</div>
              <div className="selfLabel">
                {data.personalizedHashtags?.map((item, index) => {
                  return (
                    <span key={index}>#{item}</span>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="authPosts" style={isOver600 ? { 'width': "60%" } : { 'width': "100%" }}>
            {loading ? <div style={{ display: 'flex', borderBottom: '1px dashed #E0E0E0', justifyContent: 'center' }}><div className='userTitle skeletonStyle' style={{ width: '100px', height: '1.5em', marginBottom: '20px', background: '#E0E0E0' }}></div></div>
              : <div className='userTitle'>{user?._id === authId ? '我' : data.userName}的文章</div>
            }
            <Posts userPost={{ justifyContent: 'flex-start' }} authorUrl={`/articles/findUser/${authId}`} />
          </div>
        </div>

      </div>
    </>
  )
}

export default User