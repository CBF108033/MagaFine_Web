import React, { useContext, useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import './article.scss'
import "react-quill/dist/quill.snow.css";
import "../subComponents/scrollModel.css"
import Footer from '../components/Footer'
import { useLocation, useNavigate } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import axios from 'axios'
import parse from 'html-react-parser'
import { LoginContext } from '../context/LoginContext.js'
import { OptionsContext } from '../context/OptionsContext'
import { API_URL_AWS, new_Options } from '../constants/actionTypes'
import { LABEL_CHINESE, LABEL_ENGLISH, LABEL_JAPANESE, LABEL_KOREAN, LABEL_ORIGINAL, LANG_EN, LANG_JP, LANG_KR, LANG_ZH } from '../constants/string.js';

const Article = () => {
  const locationArticleUrl = useLocation()
  const articleId = locationArticleUrl.pathname.split("/")[2]
  // const { data, loading, error } = useFetch(`/articles/${articleId}`)
  const [data, setData] = useState(null)//文章資料
  const [articleLoading, setArticleLoading] = useState(true)//文章資料載入狀態
  const [authData, setAuthData] = useState([])
  const [isLike, setIsLike] = useState(false)
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [currentSectionId, setCurrentSectionId] = useState('s1'); // default to 's1' or any starting section id
  const [currentSectionIdIsChange, setCurrentSectionIdIsChange] = useState(true); // default to 's1' or any starting section id
  const [cssGalHeight, setCssGalHeight] = useState('auto'); // default height for CSSgal
  const [sectionHeights, setSectionHeights] = useState({});
  const { user } = useContext(LoginContext)
  const isInitialMount = useRef(true);
  const sectionRefs = useRef({}); // store refs for each section
  // console.log(sectionRefs)]
  const navigate = useNavigate()
  const sections = [];
  let allData = {
    parentData: "",
    enData: "",
    zhData: "",
    krData: "",
    jpData: ""
  };

  useEffect(() => {
    async function fetchData() {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        // console.log('first render')
        // 初次渲染時就抓取一次資料
        let response = await axios.get(`${API_URL_AWS}/articles/${articleId}`)
        setData(response.data)
      } else {
        // 根據特定條件重新渲染時才抓取資料
        let response = await axios.get(`${API_URL_AWS}/articles/${articleId}`)
        setData(response.data)
      }
    }
    fetchData()
  }, [isLike])

  data?.forEach(e => {
    if (e.parentId == null || e.parentId == "") {
      allData.parentData = e;
      sections.push({ id: 's1', label: LABEL_ORIGINAL, content: allData.parentData?.content || "" })
    } else if (e.lang === LANG_EN) {
      allData.enData = e;
      sections.push({ id: 's2', label: LABEL_ENGLISH, content: allData.enData?.content || "" })
    } else if (e.lang === LANG_ZH) {
      allData.zhData = e;
      sections.push({ id: 's5', label: LABEL_CHINESE, content: allData.zhData?.content || "" })
    } else if (e.lang === LANG_KR) {
      allData.krData = e;
      sections.push({ id: 's3', label: LABEL_KOREAN, content: allData.krData?.content || "" })
    } else if (e.lang === LANG_JP) {
      allData.jpData = e;
      sections.push({ id: 's4', label: LABEL_JAPANESE, content: allData.jpData?.content })
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const userData = await axios.get(`${API_URL_AWS}/users/find/${allData.parentData.AuthorId}`)
      setAuthData(userData.data)
    }
    fetchData()
  }, [data])

  const likeBTClick = async () => {
    if (!user) return alert('請先登入')
    else {
      try {
        await axios.put(`${API_URL_AWS}/users/like/${user._id}/${articleId}`)
      } catch (err) {
        console.log(err)
      }
      setIsLike(!isLike)
    }
  }

  const { searchText, hashtag, type, category, dispatch } = useContext(OptionsContext)
  const linkTo = (e) => {
    const hashtag = e.target.innerText.split('#')[1]
    dispatch({ type: new_Options, payload: { inputText: "", hashtag: [hashtag], type: [], category: [] } })
    navigate('/')
  }

  const handleUserClick = () => {
    navigate(`/user/${allData.parentData.AuthorId}`)
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

  // 當resize時，重新計算section的高度，並更新CSSgal的高度，但會造成無限迴圈，導致網頁當機
  /*
  const checkScreenSize = () => {
    window.addEventListener('resize', () => {
      const heights = {};
      Object.keys(sectionRefs.current).forEach(id => {
        const sectionElement = sectionRefs.current[id];
        if (sectionElement) {
          heights[id] = sectionElement.offsetHeight;
        }
      });
      // console.log(heights)

      if (JSON.stringify(heights) !== JSON.stringify(sectionHeights)) {
        setSectionHeights(heights);
        setCurrentSectionIdIsChange((!currentSectionIdIsChange)); // Toggle state
      }

    });
  }
  useEffect(() => {
    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [sectionHeights])
  */

  return (
    <>
      <Navbar />
      <div className='article'>
        <div className="leftSide">
          <div className="container">
            <div className="likeBT" onClick={() => likeBTClick()}>
              {//console.log(allData.parentData?.hearts)
                allData.parentData?.hearts?.includes(user?._id) ? <img src="https://cdn-icons-png.flaticon.com/512/1550/1550594.png" alt="" />
                  : <img src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png" alt="" />
              }
              {/* {!isLike ? <img src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png" alt="" />
                : <img src="https://cdn-icons-png.flaticon.com/512/1550/1550594.png" alt="" />
              } */}
              <span>收藏</span>
            </div>
          </div>

        </div>
        <div className="mainContent">
          <div className="wrapper">
            <div className="title">{allData.parentData?.title}</div>
            <div className="subTitle">
              <span className='subTitleName' onClick={handleUserClick}>{authData.userName}&nbsp;&nbsp;&nbsp;</span>
              <span className='subTitleDate'>{allData.parentData?.createdAt?.slice(0, 10)}</span>
            </div>

            {allData.parentData?.audioUrl !== "" &&
              <div className="audio" style={{ position: 'relative' }}>
                <audio controls style={{ width: '100%' }} src={allData.parentData?.audioUrl}></audio>
                <a target='_blank' href='https://www.youtube.com/watch?v=lv5R6C3hz54' style={{ color: 'black', position: 'absolute', top: '-20px', right: '30px' }}>source</a>
              </div>
            }

            {data?.length <= 1 ?
              <div className="content ql-editor">{parse(allData.parentData?.content || "")}</div>
              :
              <div class="CSSgal" style={{ height: cssGalHeight }}>

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

                {/* Don't wrap targets in parent */}

                {sections.map(section => (
                  <s key={section.id} id={section.id}></s>
                ))}
                {/* <s id="s1"></s>
                <s id="s2"></s>
                <s id="s3"></s>
                <s id="s4"></s>
                <s id="s5"></s> */}

                <div class="slider">
                  {sections.map(section => (
                    <div key={section.id} ref={(el) => (sectionRefs.current[section.id] = el)}>
                      <div className="content ql-editor">{parse(section.content)}</div>
                    </div>
                  ))}
                  {/* <div><div className="content ql-editor">{parse(allData.parentData?.content || "")}</div></div>
                  <div><div className="content ql-editor">{parse(allData.enData?.content || "")}</div></div>
                  <div><div className="content ql-editor">{parse(allData.krData?.content || "")}</div></div>
                  <div><div className="content ql-editor">{parse(allData.jpData?.content || "")}</div></div>
                  <div><div className="content ql-editor">{parse(allData.zhData?.content || "")}</div></div> */}
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
            }


            <div className='articleInfo'>
              <div className="like">
                <img src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png" alt="" />
                {allData.parentData?.hearts?.length}
              </div>
              <div className="articleLabels">
                {allData.parentData?.length !== 0 && allData.parentData?.hashtags.map((hashtag, index) => {
                  return (
                    <span key={index} onClick={linkTo}>#{hashtag}</span>
                  )
                })}
              </div>
            </div>
            <div className="authInfo">
              <div className="left">
                <div className='photo' style={{ backgroundImage: `url("` + (authData.photo === "" ? 'https://i.imgur.com/QzIXtAa_d.webp?maxwidth=760&fidelity=grand' : authData.photo) + `")` }}></div>{/*'https://i.imgur.com/wcXhyMA.png'*/}
                <div className='contact'>IG: giraffe_71_cy <br />FB: UNKNOW</div>
              </div>
              <div className="right">
                <div className="name" onClick={handleUserClick}>{authData.userName}</div>
                <div className="description">{authData.description}</div>
                <div className="selfLabel">
                  {authData.length !== 0 && authData.personalizedHashtags.map((hashtag, index) => {
                    return (
                      <span key={index}>#{hashtag}</span>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}

export default Article