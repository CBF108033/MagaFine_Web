import React, { useState, useEffect, useContext, useRef } from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "../subComponents/EditorToolbar";
import "react-quill/dist/quill.snow.css";
import "../subComponents/editorToolbar.scss"
import useFetch from "../hooks/useFetch";
import axios from "axios";
import "./editArticle.scss"
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
// import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export const Editor = () => {
    const navigate = useNavigate()
    const locationAuthUrl = useLocation()
    const articleId = locationAuthUrl.pathname.split("/").pop()
    // console.log(articleId);
    const { data, loading } = useFetch('/articles/' + articleId)
    // console.log(data.type);

    const { user, dispatch } = useContext(LoginContext);
    // console.log(user);
    let [state, setState] = useState({
        title: "1",
        content: null,
        type: "1",
        category: "1",
        hashtags: [],
        cover: null,
        disploy: false
    });
    const [file, setFile] = useState()

    // console.log(state);
    useEffect(() => {//為什麼要用useEffect，因為data是非同步的，所以要等data有值才能setState，不然會出現data.title is undefined，
        // console.log(data.title);
        setState((p) => ({ ...p, ['title']: data.title, ['content']: data.content, ['type']: data.type, ['category']: data.category, ['hashtags']: data.hashtags, ['cover']: data.cover }))
    }, [data])


    const [category, setCategory] = useState([])
    const type = useRef(["專欄", "系列"])
    const isInitialMount = useRef(true)
    const typeSelector = useRef(null)
    const coverUpload = useRef(null)

    useEffect(() => { //設定初始化的category，isInitialMount.current = true，第一次渲染時執行
        const fetchData = async () => {
            const res = await axios.get("/articles/allArticlesType/all")
            let category = await Promise.all(res.data.column.map(i => i.category))
            if (data.type === "專欄") {
                category = await Promise.all(res.data.column.map(i => i.category))
                // console.log(category);
            } else if (data.type === "系列") {
                category = await Promise.all(res.data.series.map(i => i.category))
                // console.log(category);
            }
            setCategory(category)
        }
        typeSelector.current.value = data.type; //設定初始化的type
        coverUpload.current.value = data.cover;
        if (data.length !== 0 && isInitialMount.current) {
            isInitialMount.current = false;
            fetchData()
        }
    }, [data])
    const selectorChange = async (e) => { //選擇專欄或系列時，category會跟著改變，並且預設第一個category
        typeSelector.current.value = e.target.value;
        // const cur = e.target.value;//cur是選擇的專欄或系列，直接用e.target.value會有bug，所以先存成cur，因為底下value會吃到還沒改變的e.target.value，導致type還是原本的值
        const res = await axios.get("/articles/allArticlesType/all")
        let category;
        if (e.target.value === "系列") {
            category = await Promise.all(res.data.series.map(i => i.category))
            console.log(1, category);
        } else if (e.target.value === "專欄") {
            category = await Promise.all(res.data.column.map(i => i.category))
            console.log(2, category);
        }
        setCategory(category)
        setState((p) => ({ ...p, ['type']: e.target.value, ['category']: category[0] }));
    }
    const categorySelectorChange = (e) => { //選擇category時，category會跟著改變
        setState((p) => ({ ...p, ['category']: e.target.value }));
    }

    const handleChange = value => {
        // console.log(value);
        setState((p) => ({ ...p, ['content']: value }));
    };

    // useEffect(() => {
    //     setState((p) => ({ ...p, ['content']: data.content, ['title']: data.title }));
    // }, [data.content]);

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
            const res = await axios.put("/articles/" + user._id + "/" + articleId, state)
            navigate("/user/" + user._id + "/home")
        } catch (error) {
            // alert(error.response.data.message)
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
    console.log(state);

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
                <div className="selectors">
                    <div className="selector">
                        <div className="SelectTitle">類型</div>
                        <div className="select-wrap">
                            <select name="type" id="typeSelectorOption" onChange={e => selectorChange(e)} ref={typeSelector}> {/*用ref改變select的value*/}
                                {
                                    type.current.map((item, index) => {
                                        return <option value={item} key={index}>{item}</option>
                                    })
                                }
                                {/* <option value="專欄">專欄</option>
                                <option value="系列">系列</option> */}
                            </select>
                        </div>
                    </div>
                    <div className="selector">
                        <div className="SelectTitle">種類</div>
                        <div className="select-wrap">
                            <select name="category" id="categorySelectorOption" onChange={e => categorySelectorChange(e)} value={state?.category}>
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
                            <div className="hashTags">
                                <span>標籤</span>
                                <div className="wrapper">
                                    {
                                        state.hashtags && state.hashtags.length !== 0 && state.hashtags.map((item, index) => {
                                            return (
                                                <div className='hashTag' id="hashTag1" key={index}> #{item}<i className="fa-solid fa-xmark" onClick={removeHashtag}></i></div>
                                            )
                                        }
                                        )
                                    }
                                    <input type="text" placeholder="請輸入10字以內的標籤(Enter新增)，標籤不能包含#、空白" onKeyUp={e => addHashtag(e)} />
                                </div>
                            </div>
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