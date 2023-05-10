import React, { useContext, useEffect, useRef, useState } from 'react'
import './navbar.scss'
import { Link, useNavigate } from "react-router-dom"
import { LoginContext } from '../context/LoginContext.js'
import { logout, new_Options } from '../constants/actionTypes'
import useFetch from '../hooks/useFetch'
import { OptionsContext } from '../context/OptionsContext'

const Navbar = () => {
    const [height, setHeight] = useState(50)
    const ref = useRef(null)
    const navigate = useNavigate()

    //當畫面縮放時自動調整items(下拉式清單的top位置) 參考:https://ithelp.ithome.com.tw/articles/10225184
    useEffect(() => {
        let height = ref.current.getBoundingClientRect().height
        window.addEventListener('resize', () => setHeight(height));
        return (() => {
            window.removeEventListener('resize', () => setHeight(height));
        })
    }, [])

    const { user, dispatch } = useContext(LoginContext);
    const handleClick = (e) => {
        dispatch({ type: logout })
        // localStorage.removeItem("inputText")
        // localStorage.removeItem("hashtag")
        // localStorage.removeItem("type")
        // localStorage.removeItem("category")
        navigate("/")
    }

    const userUrl = '/users/' + user?._id || null
    const { data, isLoading, error } = useFetch(user ? userUrl : '/articles')
    // console.log('資料是: ', data)

    const linkTo = (e,c) => {
        e.stopPropagation()
        // const { searchText, hashtag, type, category, dispatch } = useContext(OptionsContext)
        // dispatch({ type: new_Options, payload: { inputText: "", hashtag: [], type: [], category: ['生活']} })
        navigate('/findArticle/category',{state:c})
    }

    const userNameClick = () => {
        if (user) navigate('/user/' + user?._id)
        else{
            alert('請先登入')
            navigate('/login')
        }
    }
    return (
        <div className='navbar' ref={ref}>
            <div className="navbarContainer">
                <Link to="/">
                    <div className="logo">
                        <img src="https://i.imgur.com/WeHJy5e_d.webp?maxwidth=760&fidelity=grand" alt="" />{/*https://i.imgur.com/0PwfKk1_d.webp?maxwidth=760&fidelity=grand*/}
                    </div>
                </Link>
                <div className="dropdown">
                    <div className="option">
                        <p>WHAT'S NEW</p>
                    </div>
                    <div className="option">
                        <p>專欄</p><img src="https://cdn-icons-png.flaticon.com/512/9497/9497400.png" alt="" />
                        <div className="items" style={{ top: +`${height - 1}` + 'px' }}>
                            <ul>
                                <li onClick={e=>linkTo(e,'生活')}>生活</li>
                                <li onClick={e=>linkTo(e,'美食')}>美食</li>
                                <li onClick={e=>linkTo(e,'電影')}>電影</li>
                                <li onClick={e=>linkTo(e,'旅遊')}>旅遊</li>
                                <li onClick={e=>linkTo(e,'開箱')}>開箱</li>
                            </ul>
                        </div>
                    </div>
                    <div className="option">
                        <p>系列</p><img src="https://cdn-icons-png.flaticon.com/512/9497/9497400.png" alt="" />
                        <div className="items" style={{ top: +`${height - 1}` + 'px' }}>
                            <ul>
                                <li onClick={e => linkTo(e,'疑難雜症')}>疑難雜症</li>
                                <li onClick={e => linkTo(e,'作品集')}>作品集</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="linkList">
                    <div className="photo"> <img src={user ? data.photo : "https://i.imgur.com/QzIXtAa_d.webp?maxwidth=760&fidelity=grand"} alt="" /></div>
                    <div className="userName" onClick={userNameClick}>{user ? user.userName : '訪客'}</div>
                    {user ?
                        <Link to={'/'}>
                            <div className='logoutBT' onClick={handleClick}>登出</div>
                        </Link>
                        :
                        <Link to={'/login'}>
                            <div className='loginBT'>登入</div>
                        </Link>
                    }
                    <div>聯絡我們</div>
                    <img className='instagramIcon' src="https://cdn-icons-png.flaticon.com/512/1384/1384031.png" alt="" />
                    <img className='facebookIcon' src="https://cdn-icons-png.flaticon.com/512/3128/3128208.png" alt="" />
                    <img className='youtubeIcon' src="https://cdn-icons-png.flaticon.com/512/1384/1384028.png" alt="" />
                </div>
            </div>
        </div>
    )
}

export default Navbar