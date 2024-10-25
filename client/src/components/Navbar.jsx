import React, { useContext, useEffect, useRef, useState } from 'react'
import './navbar.scss'
import { Link, useNavigate } from "react-router-dom"
import { LoginContext } from '../context/LoginContext.js'
import { API_URL_AWS, logout, new_Options } from '../constants/actionTypes'
import useFetch from '../hooks/useFetch'
import { OptionsContext } from '../context/OptionsContext'
// import Tooltip, {tooltipClasses} from '@mui/material/Tooltip';
// import { styled } from '@mui/material/styles';
import Tooltip from '@mui/joy/Tooltip';
import axios from 'axios';

const Navbar = () => {
    const [height, setHeight] = useState(50)
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef(null)
    const navigate = useNavigate()
    const [showTooltip, setShowTooltip] = useState(false);
    const [isNavbarHidden, setIsNavbarHidden] = useState(false);
    const [columnSeriessLst, setColumnsSeriesLst] = useState([]);

    /**
     * 取得所有專欄、系列名稱
     */
    const getColumnsSeriesLst = async () => {
        const res = await axios.get(API_URL_AWS + "/articles/allArticlesType/all");
        setColumnsSeriesLst(res.data);
    }

    useEffect(() => {
        //當畫面縮放時自動調整items(下拉式清單的top位置) 參考:https://ithelp.ithome.com.tw/articles/10225184
        let height = ref.current.getBoundingClientRect().height
        window.addEventListener('resize', () => setHeight(height));
        //取得專欄和系列清單
        getColumnsSeriesLst();
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

    const userUrl = API_URL_AWS + '/users/' + user?._id || null
    const { data, isLoading, error } = useFetch(user ? userUrl : API_URL_AWS + '/articles')
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

    // 當滾輪往下滾時隱藏navbar，往上滾時顯示navbar
    useEffect(() => {
        let prevScrollPos = window.scrollY;
        let nowUpPos = 0;
        let nowDownPos = 0;
        // 處理滾動事件
        const handleScroll = () => {
            const pageHeight = document.documentElement.scrollHeight;
            // 限制高度小於500px時不啟用導航欄功能
            if (pageHeight <= 1500) {
                setIsNavbarHidden(false);
                return;
            }
            const currentScrollPos = window.scrollY;
            if (prevScrollPos < currentScrollPos) { //往下滾
                nowDownPos = currentScrollPos;
                setIsNavbarHidden(true);
            } else { //往上滾
                nowUpPos = currentScrollPos;
                if (nowDownPos - nowUpPos > 150 || currentScrollPos < 100) {
                    setIsNavbarHidden(false);
                }
            }
            prevScrollPos = currentScrollPos;
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);

        // 清除事件監聽器
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <div className={`navbar ${isNavbarHidden ? 'hidden' : ''}`} ref={ref}>
            <div className="navbarContainer">
                <Link to="/">
                    <div className="logo">
                        <img src="https://i.imgur.com/WeHJy5e_d.webp?maxwidth=760&fidelity=grand" alt="" />{/*https://i.imgur.com/0PwfKk1_d.webp?maxwidth=760&fidelity=grand*/}
                    </div>
                </Link>

                <div className="dropdown">
                    <div className="option">
                        <Link to="/news"><p>WHAT'S NEW</p></Link>
                    </div>
                    <div className="option">
                        <p>專欄</p><img src="https://cdn-icons-png.flaticon.com/512/9497/9497400.png" alt="" />
                        <div className="items" style={{ top: +`${height - 1}` + 'px' }}>
                            <ul>
                                {
                                    columnSeriessLst?.column &&
                                    Array.from(columnSeriessLst.column).map(element => {
                                        return <li onClick={e => linkTo(e, element.category)}>{element.category}</li>
                                    })
                                }
                                {/* <li onClick={e => linkTo(e, '生活')}>生活</li>
                                <li onClick={e => linkTo(e, '美食')}>美食</li>
                                <li onClick={e => linkTo(e, '電影')}>電影</li>
                                <li onClick={e => linkTo(e, '旅遊')}>旅遊</li>
                                <li onClick={e => linkTo(e, '開箱')}>開箱</li> */}
                            </ul>
                        </div>
                    </div>
                    <div className="option">
                        <p>系列</p><img src="https://cdn-icons-png.flaticon.com/512/9497/9497400.png" alt="down" />
                        <div className="items" style={{ top: +`${height - 1}` + 'px' }}>
                            <ul>
                                {
                                    columnSeriessLst.series &&
                                    Array.from(columnSeriessLst.series).map(element => {
                                        return <li onClick={e => linkTo(e, element.category)}>{element.category}</li>
                                    })
                                }
                                {/* <li onClick={e => linkTo(e, '疑難雜症')}>疑難雜症</li>
                                <li onClick={e => linkTo(e, '作品集')}>作品集</li> */}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="linkList pc">
                    <div className="photo"> <img src={user ? data.photo : "https://i.imgur.com/wJrgG3Y_d.webp?maxwidth=760&fidelity=grand"} alt="" /></div>{/* https://i.imgur.com/QzIXtAa_d.webp?maxwidth=760&fidelity=grand */}

                    {/* 未啟用註解拿掉後有些地方要加isDisabled，忘記可以去看https://github.com/CBF108033/test0910v1/blob/e2b4882eb84a6afb85de25bc1047f351f04fdda1/src/components/Navbar.jsx#L107C41-L107C54 */}

                    {/* <!-- 未啟用，使用Tooltip/.notAllowed/.isDisabled/.notAllowed --> */}
                    {/* <div className='notAllowed isDisabled'> */}
                    <div className="userName" onClick={userNameClick}>{user ? user.userName : '訪客'}</div>
                    {/* </div> */}

                    {/* <!-- 未啟用，使用Tooltip/.notAllowed/.isDisabled/.notAllowed --> */}
                    {/* <Tooltip title="尚未啟用" arrow size="md" color="danger" variant="solid">
                        <div className='notAllowed'> */}
                    {user ?
                        <Link className='' to={'/'}>
                            <div className='logoutBT' onClick={handleClick}>登出</div>
                        </Link>
                        :
                        <Link className='' to={'/login'}>
                            <div className='loginBT'>登入</div>
                        </Link>
                    }
                    {/* </div>
                    </Tooltip> */}
                    <Link to="https://instagram.com/giraffe_71_cy?igshid=ZGUzMzM3NWJiOQ==">
                        <img className='instagramIcon' src="https://cdn-icons-png.flaticon.com/512/1384/1384031.png" alt="" />
                    </Link>
                    {/* <Tooltip title="暫無開放"> */}
                    <img className='facebookIcon' src="https://cdn-icons-png.flaticon.com/512/3128/3128208.png" alt="" />
                    {/* </Tooltip> */}
                    {/* <Tooltip title="暫無開放"> */}
                    <img className='youtubeIcon' src="https://cdn-icons-png.flaticon.com/512/1384/1384028.png" alt="" />
                    {/* </Tooltip> */}
                </div>
                {/* 手機板 */}
                <button className="navbar-toggle mobile" onClick={toggleNavbar}>
                    <span className="navbar-icon">&#9776;</span>
                </button>
                <div className='mobileNavbar' style={{ height: isOpen ? '100vh' : '0vh' }}>
                    {isOpen ?
                        <div className="linkList mobile mobileActive">
                            <div className="account">
                                <div className="photo"> <img src={user ? user.photo : "https://i.imgur.com/wJrgG3Y_d.webp?maxwidth=760&fidelity=grand"} alt="" /></div>{/*https://i.imgur.com/QzIXtAa_d.webp?maxwidth=760&fidelity=grand*/}
                                {/* <!-- 未啟用，使用Tooltip/.notAllowed/.isDisabled/.notAllowed --> */}
                                {/* <div className='notAllowed isDisabled'> */}
                                <span className="userName" onClick={userNameClick}>{user ? user.userName : '訪客'}</span>
                                {/* </div> */}
                            </div>

                            <div className="contactListMobile">
                                <Link to="https://instagram.com/giraffe_71_cy?igshid=ZGUzMzM3NWJiOQ==">
                                    <img className='instagramIcon' src="https://cdn-icons-png.flaticon.com/512/1384/1384031.png" alt="" />
                                </Link>
                                {/* <Tooltip
                                    title="尚未啟用" arrow size="md" color="danger" variant="solid"
                                    open={showTooltip}
                                    onOpen={() => setShowTooltip(true)}
                                    onClose={() => setShowTooltip(false)}
                                >
                                    <div className='notAllowed' onClick={() => setShowTooltip(!showTooltip)}> */}
                                <img className='facebookIcon' src="https://cdn-icons-png.flaticon.com/512/3128/3128208.png" alt="" />
                                {/* </div>
                                </Tooltip> */}
                                {/* <Tooltip
                                    title="尚未啟用" arrow size="md" color="danger" variant="solid"
                                    open={showTooltip}
                                    onOpen={() => setShowTooltip(true)}
                                    onClose={() => setShowTooltip(false)}
                                >
                                    <div className='notAllowed' onClick={() => setShowTooltip(!showTooltip)}> */}
                                <img className='youtubeIcon' src="https://cdn-icons-png.flaticon.com/512/1384/1384028.png" alt="" />
                                {/* </div>
                                </Tooltip> */}
                            </div>
                            {/* <Tooltip
                                title="尚未啟用" arrow size="md" color="danger" variant="solid"
                                open={showTooltip}
                                onOpen={() => setShowTooltip(true)}
                                onClose={() => setShowTooltip(false)}
                            >
                                <div className='notAllowed' onClick={() => setShowTooltip(!showTooltip)}> */}
                            {user ?
                                <Link className='' to={'/'}>
                                    <div onClick={handleClick}>登出</div>
                                </Link>
                                :
                                <Link className='' to={'/login'}>
                                    <div className='loginBT'>登入</div>
                                </Link>
                            }
                            {/* </div>
                            </Tooltip> */}
                        </div>
                        : ""
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar