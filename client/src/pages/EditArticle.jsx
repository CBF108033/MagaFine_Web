import React, { useState, useEffect, useContext, useRef } from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "../subComponents/EditorToolbar";
import "react-quill/dist/quill.snow.css";
import "../subComponents/editorToolbar.scss"
import "../subComponents/scrollModel.css"
import "./editArticle.scss"
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { LANG_EN, LANG_JP, LANG_KR, LANG_ZH } from "../constants/string";
import useEditArticleData from '../hooks/pages/useEditArticleData';
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
    const isInitialMount = useRef(true)
    const typeSelector = useRef(null)
    const coverUpload = useRef(null)
    const sectionRefs = useRef({}); // store refs for each section
    const type = useRef(["專欄", "系列"])

    const { user, dispatch } = useContext(LoginContext);
    const { data, category, loading, articleStates, saveProcess, setCatagoryField, updateArticleData, isValidHashtag } = useEditArticleData(articleId)

    useEffect(() => {//為什麼要用useEffect，因為data是非同步的，所以要等data有值才能setState，不然會出現data.title is undefined，
        // console.log(data);
        updateArticleData(data);
    }, [data])

    useEffect(() => { //設定初始化的category，isInitialMount.current = true，第一次渲染時執行
        if (data) {
            typeSelector.current.value = data.parentData?.type; //設定初始化的type
            coverUpload.current.value = data.parentData?.cover;
            if (data.parentData !== '' && isInitialMount.current) {
                isInitialMount.current = false;
                setCatagoryField(data.parentData?.type)
            }
        }
    }, [data])

    const selectorChange = async (e) => { //選擇專欄或系列時，category會跟著改變，並且預設第一個category
        typeSelector.current.value = e.target.value;
        const curType = e.target.value;//cur是選擇的專欄或系列，直接用e.target.value會有bug，所以先存成cur，因為底下value會吃到還沒改變的e.target.value，導致type還是原本的值
        setCatagoryField(curType)
        updateArticleData({ type: curType, category: category[0] });
    }

    const categorySelectorChange = (e) => { //選擇category時，category會跟著改變
        updateArticleData({ category: e.target.value });
    }

    const newHandleChange = (id) => (value) => {
        updateArticleData({ content: value }, id)
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
        updateArticleData({ disploy: disploy }, 'parentData');
        // 替換空格為特殊符號，要四格空白才能換行
        updateArticleData({ content: articleStates.parentData.content.replace(/\s{8}|\t\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') }, 'parentData');
        updateArticleData({ content: articleStates.parentData.content.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;') }, 'parentData');
        if (articleStates.parentData.title === "") {
            alert("標題不得為空")
            return
        } else if (articleStates.parentData.content === "") {
            alert("內容不得為空")
            return
        }
        saveProcess(articleStates)
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
            var replacedTag = e.target.value.replace(/(\r\n|\n|\r|\s)/gm, "");
            const status = isValidHashtag(e, replacedTag)
            if (status.res) {
                updateArticleData({ hashtags: [...articleStates.parentData.hashtags, replacedTag] }, 'parentData');
                e.target.value = "";
            } else {
                alert(status.error)
            }
        }
    }

    const removeHashtag = (e) => {
        // console.log(e.target.parentNode.innerText.split("#")[1]);
        const index = articleStates.parentData.hashtags.indexOf(e.target.parentNode.innerText.split("#")[1])
        // console.log(index);
        if (index > -1) {
            updateArticleData({ hashtags: articleStates.parentData.hashtags.filter((item) => item !== e.target.parentNode.innerText.split("#")[1]) }, 'parentData');
        }
    }
    
    const handleInputPhotos = (e) => {
        coverUpload.current.value = e.target.value;
        updateArticleData({ cover: e.target.value }, 'parentData');
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
                            <select name="category" id="categorySelectorOption" onChange={e => categorySelectorChange(e)} value={articleStates.parentData?.category}>
                                {
                                    category?.map((item, index) => {
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
                                    <input type="text" value={articleStates.parentData?.title} placeholder="請輸入標題... " onChange={(e) => updateArticleData({ title: e.target.value }, 'parentData') } />
                                </div>
                            </div>

                            <div class="CSSgal" style={{ height: cssGalHeight }}>

                                {/* Don't wrap targets in parent */}
                                {data?.sections.map(section => (
                                    <s key={section.id} id={section.id}></s>
                                ))}
                                {/* <s id="s1"></s>
                                <s id="s2"></s>
                                <s id="s3"></s>
                                <s id="s4"></s>
                                <s id="s5"></s> */}

                                <div class="bullets">
                                    {data?.sections.map(section => (
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
                                            value={articleStates.parentData?.content}
                                            onChange={newHandleChange('parentData')}
                                            placeholder={"Write something awesome..."}
                                            modules={modules}
                                            formats={formats}
                                            id="s1"
                                        />
                                    </div>
                                    <div>
                                        <ReactQuill
                                            theme="snow"
                                            value={articleStates.enData?.content}
                                            onChange={newHandleChange(LANG_EN + 'Data')}
                                            placeholder={"Write something awesome..."}
                                            // modules={modules}
                                            // formats={formats}
                                            id="s2"
                                        />
                                    </div>
                                    <div>
                                        <ReactQuill
                                            theme="snow"
                                            value={articleStates.krData?.content}
                                            onChange={newHandleChange(LANG_KR + 'Data')}
                                            placeholder={"Write something awesome..."}
                                            // modules={modules}
                                            // formats={formats}
                                            id="s3"
                                        />
                                    </div>
                                    <div>
                                        <ReactQuill
                                            theme="snow"
                                            value={articleStates.jpData?.content}
                                            onChange={newHandleChange(LANG_JP + 'Data')}
                                            placeholder={"Write something awesome..."}
                                            // modules={modules}
                                            // formats={formats}
                                            id="s4"
                                        />
                                    </div>
                                    <div>
                                        <ReactQuill
                                            theme="snow"
                                            value={articleStates.zhData?.content}
                                            onChange={newHandleChange(LANG_ZH + 'Data')}
                                            placeholder={"Write something awesome..."}
                                            // modules={modules}
                                            // formats={formats}
                                            id="s5"
                                        />
                                    </div>
                                </div>

                                <div class="prevNext">
                                    {data?.sections.map((section, index) => (
                                        <div key={index}>
                                            <a href={`#${data?.sections[(index - 1 + data?.sections.length) % data?.sections.length].id}`}
                                                onClick={() => handleClick(data?.sections[(index - 1 + data?.sections.length) % data?.sections.length].id)}>
                                                {data?.sections[(index - 1 + data?.sections.length) % data?.sections.length].label}
                                            </a>
                                            <a href={`#${data?.sections[(index + 1 + data?.sections.length) % data?.sections.length].id}`}
                                                onClick={() => handleClick(data?.sections[(index + 1 + data?.sections.length) % data?.sections.length].id)}>
                                                {data?.sections[(index + 1 + data?.sections.length) % data?.sections.length].label}
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
                                        articleStates.parentData.hashtags && articleStates.parentData.hashtags.length !== 0 && articleStates.parentData.hashtags.map((item, index) => {
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
                    <img src={articleStates.parentData?.cover || data?.parentData.cover} alt="封面圖片" />
                </div>
            </main>
        </div>
    );
};

export default Editor;