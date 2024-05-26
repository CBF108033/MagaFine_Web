import React, { useState, useEffect, useContext, useRef } from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "../subComponents/EditorToolbarForNews";
import "react-quill/dist/quill.snow.css";
import "../subComponents/editorToolbar.scss"
import useFetch from "../hooks/useFetch";
import axios from "axios";
import "./editArticle.scss"
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { API_URL_AWS } from "../constants/actionTypes";

export const Editor = () => {
    const navigate = useNavigate()
    const locationAuthUrl = useLocation()
    const articleId = locationAuthUrl.pathname.split("/").pop()
    const { data, loading } = useFetch(API_URL_AWS + '/news/' + articleId)
    // console.log(data);

    const { user, dispatch } = useContext(LoginContext);
    let [state, setState] = useState({
        title: "1",
        content: null,
        cover: null,
        disploy: false
    });
    const [file, setFile] = useState()

    useEffect(() => {//為什麼要用useEffect，因為data是非同步的，所以要等data有值才能setState，不然會出現data.title is undefined，
        setState((p) => ({ ...p, ['title']: data.title, ['content']: data.content, ['cover']: data.cover }))
    }, [data])

    // const isInitialMount = useRef(true)
    const coverUpload = useRef(null)
    
    const handleChange = value => {
        setState((p) => ({ ...p, ['content']: value }));
    };

    const back = () => {
        const confirmBox = window.confirm(
            "文章尚未儲存，確定要離開嗎?"
        )
        if (confirmBox === true) {
            navigate("/user/" + user._id + "/home")
        } else {
            return
        }
    }
    const save = async (disploy) => {
        state = { ...state, ['disploy']: disploy }
        // 替換空格為特殊符號，要四格空白才能換行
        state.content = state.content.replace(/\s{8}|\t\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
        state.content = state.content.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
        if (state.title === "") {
            alert("標題不得為空")
            return
        } else if (state.content === "") {
            alert("內容不得為空")
            return
        }
        try {
            const res = await axios.put(API_URL_AWS + "/news/" + user._id + "/" + articleId, state)
            navigate("/user/" + user._id + "/home")
        } catch (error) {
            alert("請重新登入")
        }
    }
    
    const handleInputPhotos = (e) => {
        coverUpload.current.value = e.target.value;
        setState((p) => ({ ...p, ['cover']: e.target.value }));
    }
    // console.log(state);

    return (
        <div className="text-editor">
            <div className="nav">
                <div className="nav-left" onClick={back}>
                    <i className="fa-solid fa-arrow-left-long fa-xl" style={{ color: "#3f4755" }}></i>
                    <span className="nav-left-item">列表</span>
                </div>
                <div className="nav-right">
                    <button className='saveBT' onClick={() => save(false)}>儲存(不發佈)</button>
                    <button className='saveBT' onClick={() => save(true)}>更新發佈</button>
                </div>
            </div>
            <main>
                {
                    loading ? <div style={{ fontSize: "30px", margin: "auto" }}>載入資料中...</div> :
                        <>
                            <div className="topic">
                                <div className="background-gray">
                                    <span>標題</span>
                                    <input type="text" value={state?.title} placeholder="請輸入標題... " onChange={(e) => setState((p) => ({ ...p, ['title']: e.target.value }))} />
                                </div>
                            </div>

                            <EditorToolbar />
                            <ReactQuill
                                theme="snow"
                                value={state?.content}
                                onChange={handleChange}
                                placeholder={"Write something awesome..."}
                                modules={modules}
                                formats={formats}
                            />
                        </>
                }

                <div className="uploadPhoto">
                    <div className="wrapper">
                        <span>封面圖片上傳</span>
                        <input type="text" id='photo' onChange={e=>handleInputPhotos(e)} ref={coverUpload}/>
                    </div>
                    <img src={state?.cover || data.cover} alt="封面圖片" />
                </div>
            </main>
        </div>
    );
};

export default Editor;