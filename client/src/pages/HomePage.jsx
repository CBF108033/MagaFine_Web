import { Link, useNavigate } from 'react-router-dom'
import './homePage.scss'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { parseToText, postTextLimit } from '../parse.js'
import Skeleton from '../components/Skeleton'
import { LoginContext } from '../context/LoginContext'
import { HOME_PAGE_TYPE_ARTICLE, HOME_PAGE_TYPE_NEWS, TAB_KEY } from '../constants/actionTypes'

const HomePage = () => {
    let [data, setData] = useState([])
    const [deleteState, setDeleteState] = useState(false)
    const [disployState, setDisployState] = useState(false)
    let [loading, setLoading] = useState(false)
    let tabNow = localStorage.getItem(TAB_KEY) ? localStorage.getItem("tab") : localStorage.setItem("tab", "2")
    let [tab, setTab] = useState(parseInt(tabNow))
    let [isSwitch, setIsSwitch] = useState(true)
    const navigate = useNavigate()
    const locationAuthUrl = useLocation()
    const authId = locationAuthUrl.pathname.split("/")[2]
    let allArticle = [];
    let deleteItem = [];
    // console.log(authId);

    const { user } = useContext(LoginContext)
    // console.log(user);

    const fetchArticleData = async () => {
        try {
            setLoading(true)
            if (tab === HOME_PAGE_TYPE_NEWS) { allArticle = await axios.get('/news/myself/' + user?._id) }
            else if (tab === HOME_PAGE_TYPE_ARTICLE) { allArticle = await axios.get('/articles/myself/' + user?._id) }
            setData(allArticle?.data)
            // console.log(allArticle?.data);
            setLoading(false)
        }
        catch (err) {
            alert('請重新登入')
            navigate("/login", { state: { from: locationAuthUrl.pathname } })
        }
    }

    let executedHome = false;
    useEffect(() => {
        if (!executedHome && user) {
            if (user._id === authId) fetchArticleData()
            else {
                executedHome = true;
                alert('沒有權限!')
                navigate("/user/" + user?._id + "/home")
            }
            // console.log('authId', authId);
        }
        else {
            console.log('first render')
            executedHome = true;
            alert('請先登入')
            navigate("/login", { state: { from: locationAuthUrl.pathname } })
        }
    }, [authId, tab])

    useEffect(() => {
        if (deleteState && user) {
            fetchArticleData()
            setDeleteState(false)
        }
    }, [deleteState])

    useEffect(() => {
        if (disployState && user) {
            fetchArticleData()
            setDisployState(false)
        }
    }, [disployState])

    const deleteArticle = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        const confirmBox = window.confirm(
            "確定要刪除文章嗎? 一旦刪除即無法復原!"
        )
        if (confirmBox === true) {
            if (tab === HOME_PAGE_TYPE_NEWS) { deleteItem = await axios.delete('/news/' + authId + '/' + id) }
            else if (tab === HOME_PAGE_TYPE_ARTICLE) { deleteItem = await axios.delete('/articles/' + authId + '/' + id) }
            // console.log(deleteItem);
            // console.log('/articles/' + authId + ' /' + id);
            setDeleteState(true)
        } else {
            setDeleteState(false)
        }

    }

    let executed = false;
    useEffect(() => {//有問題，要按兩次才會跳轉，
        if (!executed && !user) { //解決方法：加上executed，只執行一次
            executed = true;
            alert('請先登入')
            navigate("/login", { state: { from: locationAuthUrl.pathname } })
        }
    }, [])

    const handleTab = (e, index) => {
        // e.preventDefault()
        localStorage.setItem(TAB_KEY, index);
        setTab(index)
        setIsSwitch(!isSwitch)
    }

    const toEditPage = (url, id) => {
        return (e) => {
            e.preventDefault()
            navigate(url, { state: { id: id, type: tab } })
        }
    }

    const disploy = async (e, id, display) => {
        e.stopPropagation();
        if (tab === HOME_PAGE_TYPE_NEWS) {
            const res = await axios.put("/news/" + authId + "/" + id, { 'disploy': display })
        } else if (tab === HOME_PAGE_TYPE_ARTICLE) {
            const res = await axios.put("/articles/" + authId + "/" + id, { 'disploy': display })
        }
        setDisployState(true)
    }

    const checkScreenSize = () => {
        if (window.innerWidth < 768) {
            if (document.querySelector('.main-left')) {
                document.querySelector('.main-left').style.display = 'none';
                document.querySelector('.main-left-mobile').style.display = 'flex';
                document.querySelector('.main-right').classList.add('main-right-mobile');
            }
        } else {
            if (document.querySelector('.main-left')) {
                document.querySelector('.main-left').style.display = 'flex';
                document.querySelector('.main-left-mobile').style.display = 'none';
                document.querySelector('.main-right').classList.remove('main-right-mobile');
            }
        }
    }
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return (
        <div className='homePage'>
            <div className="nav">
                <div className="nav-left">
                    <Link to={`/user/${user?._id}`}>
                        <i class="fa-solid fa-arrow-left-long fa-xl" style={{ color: "#3f4755" }}></i>
                        <span className="nav-left-item">主頁</span>
                    </Link>
                </div>
                <div className="nav-right">
                    <Link to="/">
                        <i class="fa-solid fa-house-chimney fa-xl" style={{ color: "#3f4755" }}></i>
                    </Link>
                </div>
            </div>
            <main>
                <div className="wrapper">
                    <div className="main-left">
                        <div className="title">
                            <span>{user.userName}</span>
                        </div>
                        <div className="content">
                            <div className="add">
                                {tab === HOME_PAGE_TYPE_NEWS &&
                                    <Link to="/news/add">
                                        <i class="fa-solid fa-plus" style={{ color: "#3f4755" }}></i>
                                        <span>新增NEWS</span>
                                    </Link>
                                }
                                {tab === HOME_PAGE_TYPE_ARTICLE &&
                                    <Link to="/article/add">
                                        <i class="fa-solid fa-plus" style={{ color: "#3f4755" }}></i>
                                        <span>新增文章</span>
                                    </Link>
                                }
                            </div>
                            <div className="homePage-main-items">
                                <div className="item" onClick={e => handleTab(e, 1)}><span>NEWS</span></div>
                                <div className="item" onClick={e => handleTab(e, 2)}><span>文章</span></div>
                                <div className="item"><span>設定</span></div>
                            </div>

                        </div>
                    </div>
                    <div className="main-left main-left-mobile">
                        <div className="title row-align">
                            <span>{user.userName?.slice(0, 1)}</span>
                        </div>
                        <div className="content">
                            <div className="add row-align">
                                {tab === HOME_PAGE_TYPE_NEWS &&
                                    <Link to="/news/add" title='新增NEWS'>
                                        <i class="fa-solid fa-plus" style={{ color: "#3f4755" }}></i>
                                    </Link>
                                }
                                {tab === HOME_PAGE_TYPE_ARTICLE &&
                                    <Link to="/article/add" title='新增文章'>
                                        <i class="fa-solid fa-plus" style={{ color: "#3f4755" }}></i>
                                    </Link>
                                }
                            </div>
                            <div className="item row-align" onClick={e => handleTab(e, 1)}><i class="fa-regular fa-newspaper fa-xl" style={{ color: "#3f4755" }}></i></div>
                            <div className="item row-align" onClick={e => handleTab(e, 2)}><i class="fa-regular fa-file-lines fa-xl" style={{ color: "#3f4755" }}></i></div>
                            <div className="item row-align"><i class="fa-solid fa-gear fa-xl" style={{ color: "#3f4755" }}></i></div>
                        </div>
                    </div>
                    <div className="main-right">
                        {user ? (loading ? <Skeleton type="HomePageSkeleton_total" /> : <span className="main-right-title">全部共{data.length}筆</span>)
                            :
                            <span className="main-right-title">全部共0筆</span>
                        }
                        <div className="myArticle">
                            <div className="wrapper">
                                {loading ? <Skeleton type="HomePageSkeleton" length={5}></Skeleton> : data.map((item, index) => {
                                    let url = "";
                                    if (tab === HOME_PAGE_TYPE_NEWS) { url = "/news/edit/" + item._id }
                                    else if (tab === HOME_PAGE_TYPE_ARTICLE) { url = "/article/edit/" + item._id }
                                    return (
                                        <div className="item" key={index}>
                                            <div className='container' onClick={toEditPage(url, item._id)}>
                                                <div className="left">
                                                    <div className="cover">
                                                        <img src={item.cover} alt="" />
                                                    </div>
                                                    <div className="item-info">
                                                        <div className="item-title"><p>{item.title}</p></div>
                                                        {/* {tab === HOME_PAGE_TYPE_NEWS && <div className="item-content"><p>{item.content.length > 55 ? item.content.substring(0, 70) + `...` : item.content}</p></div>}
                                                        {tab === HOME_PAGE_TYPE_ARTICLE && <div className="item-content"><p>{postTextLimit(parseToText(item.content, 'p7'))}</p></div>} */}
                                                        <div className="item-content"><p>{postTextLimit(parseToText(item.content, 'p7'))}</p></div>
                                                        <div className="item-date"><p>{item.date}</p></div>
                                                    </div>
                                                </div>
                                                <div className="right">
                                                    {/* <div className="edit">
                                                    <i class="fa-solid fa-pencil fa-xl" style={{ color: "#3f4755" }}></i>
                                                </div> */}
                                                    {!item.disploy ?
                                                        <>
                                                            <div className="lock" onClick={e => disploy(e, item._id, true)}>
                                                                <i class="fa-solid fa-lock fa-xl" style={{ color: "#3f4755" }}></i>
                                                            </div></> :
                                                        <>
                                                            <div className="unlock" onClick={e => disploy(e, item._id, false)}>
                                                                <i class="fa-solid fa-unlock fa-xl" style={{ color: '#78c046' }}></i>
                                                            </div>
                                                        </>
                                                    }
                                                    <div className="delete" onClick={e => deleteArticle(e, item._id)}>
                                                        <i class="fa-solid fa-trash fa-xl" ></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    )
                                })}

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default HomePage