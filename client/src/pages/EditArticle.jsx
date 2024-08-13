import React, { useState, useEffect, useContext, useRef } from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "../subComponents/EditorToolbar";
import "react-quill/dist/quill.snow.css";
import "../subComponents/editorToolbar.scss"
import "../subComponents/scrollModel.css"
import useFetch from "../hooks/useFetch";
import axios from "axios";
import "./editArticle.scss"
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { API_URL_AWS } from "../constants/actionTypes";
import { LABEL_CHINESE, LABEL_ENGLISH, LABEL_JAPANESE, LABEL_KOREAN, LABEL_ORIGINAL, LANG_EN, LANG_JP, LANG_KR, LANG_ZH } from "../constants/string";
// import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export const Editor = () => {
    const [currentHash, setCurrentHash] = useState(window.location.hash);
    const [currentSectionId, setCurrentSectionId] = useState('s1'); // default to 's1' or any starting section id
    const [currentSectionIdIsChange, setCurrentSectionIdIsChange] = useState(true); // default to 's1' or any starting section id
    const [cssGalHeight, setCssGalHeight] = useState('auto'); // default height for CSSgal
    const [sectionHeights, setSectionHeights] = useState({});
    const navigate = useNavigate()
    const locationAuthUrl = useLocation()
    const articleId = locationAuthUrl.pathname.split("/").pop()
    // console.log(articleId);
    const { data, loading } = useFetch(API_URL_AWS + '/articles/' + articleId)
    const sections = [];
    const sectionRefs = useRef({}); // store refs for each section
    let allData = {
        parentData: "",
        enData: "",
        zhData: "",
        krData: "",
        jpData: ""
    };
    // console.log(data);
    data.forEach(e => {
        if (e.parentId == null || e.parentId == "") {
            allData.parentData = e;
        } else if (e.lang === LANG_EN) {
            allData.enData = e;
        } else if (e.lang === LANG_ZH) {
            allData.zhData = e;
        } else if (e.lang === LANG_KR) {
            allData.krData = e;
        } else if (e.lang === LANG_JP) {
            allData.jpData = e;
        }
    });
    sections.push({ id: 's1', label: LABEL_ORIGINAL, content: allData.parentData?.content || "" })
    sections.push({ id: 's2', label: LABEL_ENGLISH, content: allData.enData?.content || "" })
    sections.push({ id: 's3', label: LABEL_KOREAN, content: allData.krData?.content || "" })
    sections.push({ id: 's4', label: LABEL_JAPANESE, content: allData.jpData?.content })
    sections.push({ id: 's5', label: LABEL_CHINESE, content: allData.zhData?.content || "" })
    // console.log(allData);

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
    let [stateZH, setStateZH] = useState({
        title: "1",
        content: null,
        type: "1",
        category: "1",
        hashtags: [],
        cover: null,
        disploy: false
    });
    let [stateEN, setStateEN] = useState({
        title: "1",
        content: null,
        type: "1",
        category: "1",
        hashtags: [],
        cover: null,
        disploy: false
    });
    let [stateKR, setStateKR] = useState({
        title: "1",
        content: null,
        type: "1",
        category: "1",
        hashtags: [],
        cover: null,
        disploy: false
    });
    let [stateJP, setStateJP] = useState({
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
        // console.log(allData);
        setState((p) => ({ ...p, ['title']: allData.parentData.title, ['content']: allData.parentData.content, ['type']: allData.parentData.type, ['category']: allData.parentData.category, ['hashtags']: allData.parentData.hashtags, ['cover']: allData.parentData.cover }))
        setStateZH((p) => ({ ...p, ['title']: allData.zhData.title, ['content']: allData.zhData.content, ['type']: allData.zhData.type, ['category']: allData.zhData.category, ['hashtags']: allData.zhData.hashtags, ['cover']: allData.zhData.cover }))
        setStateEN((p) => ({ ...p, ['title']: allData.enData.title, ['content']: allData.enData.content, ['type']: allData.enData.type, ['category']: allData.enData.category, ['hashtags']: allData.enData.hashtags, ['cover']: allData.enData.cover }))
        setStateKR((p) => ({ ...p, ['title']: allData.krData.title, ['content']: allData.krData.content, ['type']: allData.krData.type, ['category']: allData.krData.category, ['hashtags']: allData.krData.hashtags, ['cover']: allData.krData.cover }))
        setStateJP((p) => ({ ...p, ['title']: allData.jpData.title, ['content']: allData.jpData.content, ['type']: allData.jpData.type, ['category']: allData.jpData.category, ['hashtags']: allData.jpData.hashtags, ['cover']: allData.jpData.cover }))
    }, [data])


    const [category, setCategory] = useState([])
    const type = useRef(["專欄", "系列"])
    const isInitialMount = useRef(true)
    const typeSelector = useRef(null)
    const coverUpload = useRef(null)

    useEffect(() => { //設定初始化的category，isInitialMount.current = true，第一次渲染時執行
        const fetchData = async () => {
            const res = await axios.get(API_URL_AWS + "/articles/allArticlesType/all")
            let category = await Promise.all(res.data.column.map(i => i.category))
            if (allData.parentData.type === "專欄") {
                category = await Promise.all(res.data.column.map(i => i.category))
                // console.log(category);
            } else if (allData.parentData.type === "系列") {
                category = await Promise.all(res.data.series.map(i => i.category))
                // console.log(category);
            }
            setCategory(category)
        }
        typeSelector.current.value = allData.parentData.type; //設定初始化的type
        coverUpload.current.value = allData.parentData.cover;
        if (allData.parentData.length !== 0 && isInitialMount.current) {
            isInitialMount.current = false;
            fetchData()
        }
    }, [data])
    const selectorChange = async (e) => { //選擇專欄或系列時，category會跟著改變，並且預設第一個category
        typeSelector.current.value = e.target.value;
        // const cur = e.target.value;//cur是選擇的專欄或系列，直接用e.target.value會有bug，所以先存成cur，因為底下value會吃到還沒改變的e.target.value，導致type還是原本的值
        const res = await axios.get(API_URL_AWS + "/articles/allArticlesType/all")
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
        setStateZH((p) => ({ ...p, ['type']: e.target.value, ['category']: category[0] }));
        setStateEN((p) => ({ ...p, ['type']: e.target.value, ['category']: category[0] }));
        setStateKR((p) => ({ ...p, ['type']: e.target.value, ['category']: category[0] }));
        setStateJP((p) => ({ ...p, ['type']: e.target.value, ['category']: category[0] }));
    }
    const categorySelectorChange = (e) => { //選擇category時，category會跟著改變
        setState((p) => ({ ...p, ['category']: e.target.value }));
        setStateZH((p) => ({ ...p, ['category']: e.target.value }));
        setStateEN((p) => ({ ...p, ['category']: e.target.value }));
        setStateKR((p) => ({ ...p, ['category']: e.target.value }));
        setStateJP((p) => ({ ...p, ['category']: e.target.value }));
    }

    const handleChange = (value, id) => {
        // console.log(value);
        // console.log(id);
        if (id === 'parent') {
            setState((p) => ({ ...p, ['content']: value }));
        } else if (id === 'zh') {
            setStateZH((p) => ({ ...p, ['content']: value }));
        } else if (id === 'en') {
            setStateEN((p) => ({ ...p, ['content']: value }));
        } else if (id === 'kr') {
            setStateKR((p) => ({ ...p, ['content']: value }));
        } else if (id === 'jp') {
            setStateJP((p) => ({ ...p, ['content']: value }));
        }
    };

    const newHandleChange = (id) => (value) => {
        handleChange(value, id);
    };

    // useEffect(() => {
    //     setState((p) => ({ ...p, ['content']: allData.parentData.content, ['title']: allData.parentData.title }));
    // }, [allData.parentData.content]);

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
            // console.log(stateEN.content, allData.enData._id);
            if (state.content && state.content.length > 0) {
                const res = await axios.put(API_URL_AWS + "/articles/" + user._id + "/" + articleId, state)
            }
            if (stateZH.content && stateZH.content.length > 0) {
                const res = await axios.put(API_URL_AWS + "/articles/" + user._id + "/" + allData.zhData._id, stateZH)
            }
            if (stateEN.content && stateEN.content.length > 0) {
                const res = await axios.put(API_URL_AWS + "/articles/" + user._id + "/" + allData.enData._id, stateEN)
            }
            if (stateKR.content && stateKR.content.length > 0) {
                const res = await axios.put(API_URL_AWS + "/articles/" + user._id + "/" + allData.krData._id, stateKR)
            }
            if (stateJP.content && stateJP.content.length > 0) {
                const res = await axios.put(API_URL_AWS + "/articles/" + user._id + "/" + allData.jpData._id, stateJP)
            }
            // const res = await axios.put(API_URL_AWS + "/articles/" + user._id + "/" + articleId, state)
            // navigate("/user/" + user._id + "/home")
            alert("儲存成功!")
            refreshPage()
        } catch (error) {
            // alert(error.response.data.message)
            console.log(error);
            alert("請重新登入")
        }
    }

    const refreshPage = () => {
        window.location.reload();
    }
    /** TODO 自動儲存功能(10/28未完成) */
    // setInterval(async () => {
    //     state = { ...state, ['disploy']: false }
    //     // 替換空格為特殊符號，要四格空白才能換行
    //     state.content = state.content?.replace(/\s{8}|\t\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
    //     state.content = state.content?.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    //     if (state.title !== "" && state.content !== "") {
    //         try {
    //             const res = await axios.put("/articles/" + user._id + "/" + articleId, state)
    //             setTimeout(() => {
    //                 if (document.querySelector(".saving")) {
    //                     document.querySelector(".saving").innerHTML = "儲存中..."
    //                 }
    //             }, 1000);
    //             if (document.querySelector(".saving")) {
    //                 document.querySelector(".saving").innerHTML = ""
    //             }
    //         } catch (error) {
    //             // alert(error)
    //             alert("請重新登入")
    //         }
    //     }
    // }, 10000);

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

    //滑動到頁面頂部
    const handleClick = (id) => {
        window.location.hash = id;
        setCurrentSectionId(id);
        setCurrentSectionIdIsChange(!currentSectionIdIsChange);
        // 滾動到頁面頂部
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // 平滑滾動
        });
    }

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentHash(window.location.hash);
        };
        // 監聽hashchange事件
        window.addEventListener('hashchange', handleHashChange);
        // 清除事件監聽器
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    // Track the change in section id and update the height of CSSgal
    // 依文章分配頁面高度
    useEffect(() => {
        if (sectionRefs.current[currentSectionId]) {
            const sectionHeight = `${sectionHeights[currentSectionId] + 40}px` || 'auto';
            setCssGalHeight(sectionHeight);
            // console.log('sectionHeight', sectionHeight, sectionHeights[currentSectionId]);
        }
    }, [currentSectionIdIsChange]);

    useEffect(() => {
        const heights = {};
        Object.keys(sectionRefs.current).forEach(id => {
            const sectionElement = sectionRefs.current[id];
            if (sectionElement) {
                heights[id] = sectionElement.offsetHeight;
            }
        });
        setSectionHeights(heights);
    }, [data]);

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
                <div className="saving"></div>
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

                            <div class="CSSgal" style={{ height: cssGalHeight }}>

                                {/* Don't wrap targets in parent */}
                                {sections.map(section => (
                                    <s key={section.id} id={section.id}></s>
                                ))}
                                {/* <s id="s1"></s>
                                <s id="s2"></s>
                                <s id="s3"></s>
                                <s id="s4"></s>
                                <s id="s5"></s> */}

                                <div class="bullets">
                                    {sections.map(section => (
                                        <a key={section.id} href={`#${section.id}`} onClick={() => handleClick(section.id)}
                                            style={{
                                                backgroundColor:
                                                    currentHash === '' && section.id === 's1'
                                                        ? 'rgb(0 0 0 / 9%)'
                                                        : currentHash === `#${section.id}`
                                                            ? 'rgb(0 0 0 / 9%)'
                                                            : 'transparent',
                                                color: 'black'
                                            }}>
                                            {section.label}
                                        </a>
                                    ))}
                                    {/* <a href="#s1" onClick={() => handleClick('s1')}>1(ORI)</a>
                                    <a href="#s2" onClick={() => handleClick('s2')}>2(EN)</a>
                                    <a href="#s3" onClick={() => handleClick('s3')}>3(KR)</a>
                                    <a href="#s4" onClick={() => handleClick('s4')}>4(JP)</a>
                                    <a href="#s5" onClick={() => handleClick('s5')}>5(ZH)</a> */}
                                </div>

                                <div class="slider">
                                    <div>
                                        <EditorToolbar />
                                        <ReactQuill
                                            theme="snow"
                                            value={state?.content}
                                            onChange={newHandleChange('parent')}
                                            placeholder={"Write something awesome..."}
                                            modules={modules}
                                            formats={formats}
                                            id="s1"
                                        />
                                    </div>
                                    <div>
                                        <ReactQuill
                                            theme="snow"
                                            value={stateEN?.content}
                                            onChange={newHandleChange(LANG_EN)}
                                            placeholder={"Write something awesome..."}
                                            // modules={modules}
                                            // formats={formats}
                                            id="s2"
                                        />
                                    </div>
                                    <div>
                                        <ReactQuill
                                            theme="snow"
                                            value={stateKR?.content}
                                            onChange={newHandleChange(LANG_KR)}
                                            placeholder={"Write something awesome..."}
                                            // modules={modules}
                                            // formats={formats}
                                            id="s3"
                                        />
                                    </div>
                                    <div>
                                        <ReactQuill
                                            theme="snow"
                                            value={stateJP?.content}
                                            onChange={newHandleChange(LANG_JP)}
                                            placeholder={"Write something awesome..."}
                                            // modules={modules}
                                            // formats={formats}
                                            id="s4"
                                        />
                                    </div>
                                    <div>
                                        <ReactQuill
                                            theme="snow"
                                            value={stateZH?.content}
                                            onChange={newHandleChange(LANG_ZH)}
                                            placeholder={"Write something awesome..."}
                                            // modules={modules}
                                            // formats={formats}
                                            id="s5"
                                        />
                                    </div>
                                </div>

                                <div class="prevNext">
                                    {sections.map((section, index) => (
                                        <div key={index}>
                                            <a href={`#${sections[(index - 1 + sections.length) % sections.length].id}`}
                                                onClick={() => handleClick(sections[(index - 1 + sections.length) % sections.length].id)}>
                                                {sections[(index - 1 + sections.length) % sections.length].label}
                                            </a>
                                            <a href={`#${sections[(index + 1 + sections.length) % sections.length].id}`}
                                                onClick={() => handleClick(sections[(index + 1 + sections.length) % sections.length].id)}>
                                                {sections[(index + 1 + sections.length) % sections.length].label}
                                            </a>
                                        </div>
                                    ))}
                                    {/* <div><a href="#s5" onClick={() => handleClick('s5')}>ZH</a><a href="#s2" onClick={() => handleClick('s2')}>EN</a></div>
                                    <div><a href="#s1" onClick={() => handleClick('s1')}>ORI</a><a href="#s3" onClick={() => handleClick('s3')}>KR</a></div>
                                    <div><a href="#s2" onClick={() => handleClick('s2')}>EN</a><a href="#s4" onClick={() => handleClick('s4')}>JP</a></div>
                                    <div><a href="#s3" onClick={() => handleClick('s3')}>KR</a><a href="#s5" onClick={() => handleClick('s5')}>ZH</a></div>
                                    <div><a href="#s4" onClick={() => handleClick('s4')}>JP</a><a href="#s1" onClick={() => handleClick('s1')}>ORI</a></div> */}
                                </div>

                            </div>


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
                        <input type="text" id='photo' onChange={e => handleInputPhotos(e)} ref={coverUpload} />
                    </div>
                    <img src={state?.cover || allData.parentData.cover} alt="封面圖片" />
                </div>
            </main>
        </div>
    );
};

export default Editor;