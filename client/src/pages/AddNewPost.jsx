import React, { useContext, useEffect, useRef, useState } from 'react'
import './addNewPost.scss'
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "../subComponents/EditorToolbar";
import "react-quill/dist/quill.snow.css";
import "../subComponents/editorToolbar.scss"
import { LoginContext } from '../context/LoginContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddNewPost = () => {
    const { user, dispatch } = useContext(LoginContext);
    const navigate = useNavigate()
    let [state, setState] = useState({
        title: "",
        content: "",
        type: "專欄",
        category: "生活",
        hashtags: [],
        cover: null,
        disploy: false,
    });
    const [category, setCategory] = useState([])
    const [type, setType] = useState("專欄")
    const isInitialMount = useRef(true);
    const coverUpload = useRef(null)

    useEffect(() => { //設定初始化的category，isInitialMount.current = true，第一次渲染時執行
        const fetchData = async () => {
            const res = await axios.get("/articles/allArticlesType/all")
            let category = await Promise.all(res.data.column.map(i => i.category))
            console.log(category);
            if (type === "專欄") {
                category = await Promise.all(res.data.column.map(i => i.category))
                console.log(category);
            } else if (type === "系列") {
                category = await Promise.all(res.data.series.map(i => i.category))
                console.log(category);
            }
            setCategory(category)
        }
        if (isInitialMount.current) {
            isInitialMount.current = false;
            fetchData()
        }
    }, [])
    const selectorChange = async (e) => { //選擇專欄或系列時，category會跟著改變，並且預設第一個category
        // console.log(e.target.value);
        const res = await axios.get("/articles/allArticlesType/all")
        let category;
        if (e.target.value === "系列") {
            setType(e.target.value)
            category = await Promise.all(res.data.series.map(i => i.category))
        } else if (e.target.value === "專欄") {
            setType(e.target.value)
            category = await Promise.all(res.data.column.map(i => i.category))
        }
        setCategory(category)
        setState((p) => ({ ...p, ['type']: e.target.value, ['category']: category[0] }));
    }
    const categorySelectorChange = (e) => { //選擇category時，category會跟著改變
        setState((p) => ({ ...p, ['category']: e.target.value }));
    }

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
            const res = await axios.post("/articles/" + user._id, state)
            navigate("/user/" + user._id + "/home")
        } catch (error) {
            alert(error.response.data.message)
            alert("請重新登入")
        }
    }
    const addHashtag = async (e) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
            // console.log(e.target.value);
            var res = e.target.value.replace(/(\r\n|\n|\r|\s)/gm, "");
            if (res === "") {
                alert("輸入不得為空")
                e.target.value = "";
                return
            } else if (res.length > 10) {
                alert("hashtag字數不得超過10字")
                return
            } else if (res.includes("#")) {
                alert("hashtag不得包含#")
                return
            } else {
                if (res != "" && !state.hashtags.includes(res)) {
                    await setState((p) => ({ ...p, ['hashtags']: [...p.hashtags, res] }));
                    e.target.value = "";
                } else {
                    alert("hashtag不得重複")
                    e.target.value = "";
                    return
                }
            }
        }
    }
    const removeHashtag = (e) => {
        // console.log(e.target.parentNode.innerText.split("#")[1]);
        const index = state.hashtags.indexOf(e.target.parentNode.innerText.split("#")[1])
        // console.log(index);
        if (index > -1) {
            setState((p) => ({ ...p, ['hashtags']: p.hashtags.filter((item) => item !== e.target.parentNode.innerText.split("#")[1]) }));
        }
    }
    const handleInputPhotos = (e) => {
        coverUpload.current.value = e.target.value;
        setState((p) => ({ ...p, ['cover']: e.target.value }));
    }

    return (
        <div className='addNewPost'>
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
                <div className="selectors">
                    <div className="selector">
                        <div className="SelectTitle">類型</div>
                        <div className="select-wrap">
                            <select name="type" id="typeSelectorOption" onChange={e => selectorChange(e)}>
                                <option value="專欄">專欄</option>
                                <option value="系列">系列</option>
                            </select>
                        </div>
                    </div>
                    <div className="selector">
                        <div className="SelectTitle">種類</div>
                        <div className="select-wrap">
                            <select name="category" id="categorySelectorOption" onChange={e => categorySelectorChange(e)}>
                                {
                                    category.map((item, index) => {
                                        return <option value={item} key={index}>{item}</option>
                                    })
                                }
                                {/* <option value="">生活</option>
                                <option value="">電影</option>
                                <option value="">旅遊</option>
                                <option value="">旅遊旅遊旅遊旅遊</option> */}
                            </select>
                        </div>
                    </div>
                </div>
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
                <div className="hashTags">
                    <span>標籤</span>
                    <div className="wrapper">
                        {
                            state.hashtags.map((item, index) => {
                                return (
                                    <div className='hashTag' id="hashTag1" key={index}> #{item}<i className="fa-solid fa-xmark" onClick={removeHashtag}></i></div>
                                )
                            }
                            )
                        }
                        <input type="text" placeholder="請輸入10字以內的標籤(Enter新增)，標籤不能包含#、空白" onKeyUp={e => addHashtag(e)} />
                    </div>
                </div>

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

export default AddNewPost