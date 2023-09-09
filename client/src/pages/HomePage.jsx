import { Link, useNavigate } from 'react-router-dom'
import './homePage.scss'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { parseToText, postTextLimit } from '../parse.js'
import Skeleton from '../components/Skeleton'
import { LoginContext } from '../context/LoginContext'

const HomePage = () => {
    let [data, setData] = useState([])
    const [deleteState, setDeleteState] = useState(false)
    let [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const locationAuthUrl = useLocation()
    const authId = locationAuthUrl.pathname.split("/")[2]
    // console.log(authId);

    const { user } = useContext(LoginContext)
    console.log(user);

    const fetchArticleData = async () => {
        try {
            setLoading(true)
            const allArticle = await axios.get('/articles/myself/' + user?._id)
            setData(allArticle?.data)
            console.log(allArticle?.data);
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
            console.log('authId', authId);
        }
        else {
            console.log('first render')
            executedHome = true;
            alert('請先登入')
            navigate("/login", { state: { from: locationAuthUrl.pathname } })
        }
    }, [authId])
    useEffect(() => {
        if (deleteState && user) {
            fetchArticleData()
            setDeleteState(false)
        }
    }, [deleteState])
    const deleteArticle = async (e, id) => {
        e.preventDefault()
        const confirmBox = window.confirm(
            "確定要刪除文章嗎? 一旦刪除即無法復原!"
        )
        if (confirmBox === true) {
            const deleteArticle = await axios.delete('/articles/' + authId + '/' + id)
            console.log(deleteArticle);
            console.log('/articles/' + authId + ' /' + id);
            setDeleteState(true)
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
                                <Link to="/article/add">
                                    <i class="fa-solid fa-plus" style={{ color: "#3f4755" }}></i>
                                    <span>新文章</span>
                                </Link>
                            </div>
                            <div className="homePage-main-items">
                                <div className="item"><span>文章</span></div>
                                <div className="item"><span>設定</span></div>
                            </div>

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
                                    const url = "/article/edit/" + item._id
                                    return (
                                        <div className="item" key={index}>
                                            <Link to={url}>
                                                <div className="left">
                                                    <div className="cover">
                                                        <img src={item.cover} alt="" />
                                                    </div>
                                                    <div className="item-info">
                                                        <div className="item-title"><p>{item.title}</p></div>
                                                        <div className="item-content"><p>{postTextLimit(parseToText(item.content, 'p7'))}</p></div>
                                                        <div className="item-date"><p>{item.date}</p></div>
                                                    </div>
                                                </div>
                                                <div className="right">
                                                    {/* <div className="edit">
                                                    <i class="fa-solid fa-pencil fa-xl" style={{ color: "#3f4755" }}></i>
                                                </div> */}
                                                    <div className="delete" onClick={e => deleteArticle(e, item._id)}>
                                                        <i class="fa-solid fa-trash fa-xl" style={{ color: "#3f4755" }}></i>
                                                    </div>
                                                </div>
                                            </Link>
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