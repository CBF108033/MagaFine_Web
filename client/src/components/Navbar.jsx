import React, { useEffect, useRef, useState } from 'react'
import './navbar.scss'
import { Link } from "react-router-dom"

const Navbar = () => {
    const [height, setHeight] = useState(50)
    const ref = useRef(null)

    //當畫面縮放時自動調整items(下拉式清單的top位置) 參考:https://ithelp.ithome.com.tw/articles/10225184
    useEffect(() => {
        let height = ref.current.getBoundingClientRect().height
        window.addEventListener('resize', () => setHeight(height));
        return (() => {
            window.removeEventListener('resize', () => setHeight(height));
        })
    }, [])
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
                                <li>生活</li>
                                <li>美食</li>
                                <li>電影</li>
                                <li>旅遊</li>
                                <li>開箱</li>
                            </ul>
                        </div>
                    </div>
                    <div className="option">
                        <p>系列</p><img src="https://cdn-icons-png.flaticon.com/512/9497/9497400.png" alt="" />
                        <div className="items" style={{ top: +`${height - 1}` + 'px' }}>
                            <ul>
                                <li>疑難雜症</li>
                                <li>作品集</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="linkList">
                    <div className='loginBT'>登入</div>
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