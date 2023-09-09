import React, { useContext, useEffect, useRef, useState } from 'react'
import './navbar.scss'
import { Link, useNavigate } from "react-router-dom"
import { LoginContext } from '../context/LoginContext.js'
import { logout, new_Options } from '../constants/actionTypes'
import useFetch from '../hooks/useFetch'
import { OptionsContext } from '../context/OptionsContext'
// import Tooltip, {tooltipClasses} from '@mui/material/Tooltip';
// import { styled } from '@mui/material/styles';
import Tooltip from '@mui/joy/Tooltip';

const Navbar = () => {
    const [height, setHeight] = useState(50)
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef(null)
    const navigate = useNavigate()
    const [showTooltip, setShowTooltip] = useState(false);

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

    const linkTo = (e, c) => {
        e.stopPropagation()
        // const { searchText, hashtag, type, category, dispatch } = useContext(OptionsContext)
        // dispatch({ type: new_Options, payload: { inputText: "", hashtag: [], type: [], category: ['生活']} })
        navigate('/findArticle/category', { state: c })
    }

    const userNameClick = () => {
        if (user) navigate('/user/' + user?._id)
        else {
            alert('請先登入')
            navigate('/login')
        }
    }

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
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
                                <li onClick={e => linkTo(e, '生活')}>生活</li>
                                <li onClick={e => linkTo(e, '美食')}>美食</li>
                                <li onClick={e => linkTo(e, '電影')}>電影</li>
                                <li onClick={e => linkTo(e, '旅遊')}>旅遊</li>
                                <li onClick={e => linkTo(e, '開箱')}>開箱</li>
                            </ul>
                        </div>
                    </div>
                    <div className="option">
                        <p>系列</p><img src="https://cdn-icons-png.flaticon.com/512/9497/9497400.png" alt="down" />
                        <div className="items" style={{ top: +`${height - 1}` + 'px' }}>
                            <ul>
                                <li onClick={e => linkTo(e, '疑難雜症')}>疑難雜症</li>
                                <li onClick={e => linkTo(e, '作品集')}>作品集</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="linkList pc">
                    <div className="photo"> <img src={user ? data.photo : "https://i.imgur.com/QzIXtAa_d.webp?maxwidth=760&fidelity=grand"} alt="" /></div>
                    {/* <!-- 未啟用，使用Tooltip/.notAllowed/.isDisabled/.notAllowed --> */}
                    {/* <div className='notAllowed isDisabled'> */}
                        <div className="userName" onClick={userNameClick}>{user ? user.userName : '訪客'}</div>
                    {/* </div> */}

                    {/* <!-- 未啟用，使用Tooltip/.notAllowed/.isDisabled/.notAllowed --> */}
                    {/* <Tooltip title="尚未啟用" arrow size="md" color="danger" variant="solid">
                        <div className='notAllowed'> */}
                            {user ?
                                <Link className='isDisabled' to={'/'}>
                                    <div className='logoutBT' onClick={handleClick}>登出</div>
                                </Link>
                                :
                                <Link className='isDisabled' to={'/login'}>
                                    <div className='loginBT'>登入</div>
                                </Link>
                            }
                        {/* </div>
                    </Tooltip> */}
                    <Link to="https://instagram.com/giraffe_71_cy?igshid=ZGUzMzM3NWJiOQ==">
                        <img className='instagramIcon' src="https://cdn-icons-png.flaticon.com/512/1384/1384031.png" alt="" />
                    </Link>
                    <Tooltip title="暫無開放">
                        <img className='facebookIcon' src="https://cdn-icons-png.flaticon.com/512/3128/3128208.png" alt="" />
                    </Tooltip>
                    <Tooltip title="暫無開放">
                        <img className='youtubeIcon' src="https://cdn-icons-png.flaticon.com/512/1384/1384028.png" alt="" />
                    </Tooltip>
                </div>
                {/* 手機板 */}
                <button className="navbar-toggle mobile" onClick={toggleNavbar}>
                    <span className="navbar-icon">&#9776;</span>
                </button>
                <div className='mobileNavbar' style={{ height: isOpen ? '100vh' : '0vh' }}>
                    {isOpen ?
                        <div className="linkList mobile mobileActive">
                            <div className="account">
                                <div className="photo"> <img src={user ? user.photo : "https://i.imgur.com/QzIXtAa_d.webp?maxwidth=760&fidelity=grand"} alt="" /></div>
                                {/* <!-- 未啟用，使用Tooltip/.notAllowed/.isDisabled/.notAllowed --> */}
                                <div className='notAllowed isDisabled'>
                                    <span className="userName isDisabled" onClick={userNameClick}>{user ? user.userName : '訪客'}</span>
                                </div>
                            </div>

                            <div className="contactListMobile">
                                <Link to="https://instagram.com/giraffe_71_cy?igshid=ZGUzMzM3NWJiOQ==">
                                    <img className='instagramIcon' src="https://cdn-icons-png.flaticon.com/512/1384/1384031.png" alt="" />
                                </Link>
                                <Tooltip
                                    title="尚未啟用" arrow size="md" color="danger" variant="solid"
                                    open={showTooltip}
                                    onOpen={() => setShowTooltip(true)}
                                    onClose={() => setShowTooltip(false)}
                                >
                                    <div className='notAllowed' onClick={() => setShowTooltip(!showTooltip)}>
                                        <img className='facebookIcon' src="https://cdn-icons-png.flaticon.com/512/3128/3128208.png" alt="" />
                                    </div>
                                </Tooltip>
                                <Tooltip
                                    title="尚未啟用" arrow size="md" color="danger" variant="solid"
                                    open={showTooltip}
                                    onOpen={() => setShowTooltip(true)}
                                    onClose={() => setShowTooltip(false)}
                                >
                                    <div className='notAllowed' onClick={() => setShowTooltip(!showTooltip)}>
                                        <img className='youtubeIcon' src="https://cdn-icons-png.flaticon.com/512/1384/1384028.png" alt="" />
                                    </div>
                                </Tooltip>
                            </div>
                            <Tooltip
                                title="尚未啟用" arrow size="md" color="danger" variant="solid"
                                open={showTooltip}
                                onOpen={() => setShowTooltip(true)}
                                onClose={() => setShowTooltip(false)}
                            >
                                <div className='notAllowed' onClick={() => setShowTooltip(!showTooltip)}>
                                    {user ?
                                        <Link className='isDisabled' to={'/'}>
                                            <div onClick={handleClick}>登出</div>
                                        </Link>
                                        :
                                        <Link className='isDisabled' to={'/login'}>
                                            <div className='loginBT'>登入</div>
                                        </Link>
                                    }
                                </div>
                            </Tooltip>
                        </div>
                        : ""
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar