import React, { useContext, useEffect, useRef, useState } from 'react'
import './addNewNews.scss'
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "../subComponents/EditorToolbarForNews";
import "react-quill/dist/quill.snow.css";
import "../subComponents/editorToolbar.scss"
import { LoginContext } from '../context/LoginContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL_AWS } from '../constants/actionTypes';

const AddNewNews = () => {
    const { user, dispatch } = useContext(LoginContext);
    const navigate = useNavigate()
    let [state, setState] = useState({
        title: "",
        content: null,
        cover: null,
        disploy: false,
    });
    const coverUpload = useRef(null)

    const handleChange = value => {
        console.log(value);
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
        if (state.title === "") {
            alert("標題不得為空")
            return
        } else if (state.content === "") {
            alert("內容不得為空，且至少兩段")
            return
        }else if (state.cover === null) {
            alert("封面圖片不得為空")
            return
        }
        try {
            const res = await axios.post(API_URL_AWS + "/news/" + user._id, state)
            navigate("/user/" + user._id + "/home")
        } catch (error) {
            alert(error.response.data.message)
            alert("請重新登入")
        }
    }
    const handleInputPhotos = (e) => {
        coverUpload.current.value = e.target.value;
        setState((p) => ({ ...p, ['cover']: e.target.value }));
    }

    return (
        <div className='AddNewNews'>
            <div className="nav">
                <div className="nav-left" onClick={back}>
                    <i className="fa-solid fa-arrow-left-long fa-xl" style={{ color: "#3f4755" }}></i>
                    <span className="nav-left-item">列表</span>
                </div>
                <div className="nav-right">
                    <button className='saveBT' onClick={e => save(false)}>儲存(不發佈)</button>
                    <button className='saveBT' onClick={e => save(true)}>發佈</button>
                </div>
            </div>
            <main>
                <div className="topic">
                    <div className="background-gray">
                        <span>標題</span>
                        <input type="text" value={state.title} placeholder="請輸入標題... " onChange={(e) => setState((p) => ({ ...p, ['title']: e.target.value }))} />
                    </div>
                </div>

                <EditorToolbar />
                <ReactQuill
                    theme="snow"
                    value={state.content}
                    onChange={handleChange}
                    placeholder={"Write something awesome..."}
                    modules={modules}
                    formats={formats}
                />

                <div className="uploadPhoto">
                    <div className="wrapper">
                        <span>封面圖片上傳</span>
                        <input type="text" id='photo' onChange={e => handleInputPhotos(e)} ref={coverUpload} />
                    </div>
                    {(state?.cover) ?
                        <><img src={state?.cover} alt="封面圖片" /></> 
                        :                       
                        <></>
                    }

                </div>
            </main>
        </div>
    )
}

export default AddNewNews