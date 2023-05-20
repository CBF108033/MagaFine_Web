import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './categoryArticle.scss'
import Navbar from '../components/Navbar'
import Posts from '../components/Posts'
import Footer from '../components/Footer'
// import './categoryArticle.scss'
import { Link, useLocation } from 'react-router-dom'
import Searchbar from '../components/Searchbar'
import useFetch from '../hooks/useFetch'
import axios from 'axios'
import Skeleton from '../components/Skeleton'
import { parseToText, postTextLimit } from '../parse.js'

const CategoryArticle = () => {
    //回首頁時到頁面最頂部
    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    });
    const content = useRef(null)
    const [isOpenSearch, setIsOpenSearch] = useState(false)
    const ArticleData = useLocation()
    // console.log(ArticleData.state)

    const searchUrl = `/articles?${ArticleData.state && "category=" + ArticleData.state }`
    // console.log(searchUrl)
    const { data, loading, error } = useFetch(searchUrl)

    const [authData, setAuthData] = useState([])
    const [authLoading, setAuthLoading] = useState(false)
    useEffect(() => {
        setAuthLoading(true)
        const fetchData = async () => {
            const userData = await Promise.all(data.map(async (item, i) => { return await axios.get(`/users/find/${item.AuthorId}`) }))
            setAuthData(userData)
            setAuthLoading(false)
        }
        fetchData()
    }, [data])
    return (
        <div className='categoryArticle'>
            <div className="top">
                <Navbar />
                <Searchbar isOpen={(i) => { setIsOpenSearch(i) }} />
                <div className="category">
                    <p>— {ArticleData.state} —</p>
                </div>
                <div className='posts'>
                    <div className="postContainer" style={{ position: 'relative' }}>
                        <div className="postWrapper">
                            {data.length != 0 ?
                                loading || authLoading ? <Skeleton type="postSkeleton" length={4} /> : data.map((item, index) =>
                                    <div className="post" key={index}>
                                        <div className="cover"><img src={item.cover} /></div>
                                        <div className="info">
                                            <div className="type">{item.category}</div>
                                            <Link to={`/article/${item._id}`}>
                                                <div className="title">{item.title}</div>
                                            </Link>
                                            <div className="authorNdate">
                                                {/* //因為authData是用Promise.all處理的，所以會比data晚一步，因此要用長度來判斷，而不是用data[index]來判斷，因為data[index]會先出現undefined再出現資料，所以用長度來判斷，長度相等時，代表資料都已經出來了。 */}
                                                <div className="author">{authData.length !== 0 && authData.length === data.length && authData[index].data.userName}</div>
                                                <div className="date">{item.createdAt.slice(0, 10)}</div>
                                            </div>
                                            <div className="content">
                                                <p ref={content}></p>
                                                {//有找到關鍵字，顯示關鍵字前後10個字，沒找到顯示前75個字，超過75個字顯示...
                                                    //Math.max用來防止index為負數，Math.min用來防止index超過字串長度，用法為Math.max(0, index)，Math.min(index, 字串長度)，index為負數時會回傳0，index超過字串長度時會回傳字串長度。
                                                    /*inputText !== "" ? //有輸入關鍵字時，擷取有包含關鍵字的前五個內容的前後10個字
                                                      [...item.content.matchAll(inputText)].map(match => match.index).slice(0, 5).map((i, times) =>
                                                        times !== 0 ? //第一個關鍵字前10個字不用顯示...，其他關鍵字前後10個字要顯示...
                                                          parse(("\u00A0\u00A0\u00A0\u00A0" + item.content.substring(Math.max(i - 5, 0), Math.min(i + inputText.length + 5, item.content.length)) + '...').replace(inputText, `<span class="highlight">${inputText}</span>`))
                                                          : parse((item.content.substring(Math.max(i - 5, 0), Math.min(i + inputText.length + 5, item.content.length)) + '...').replace(inputText, `<span class="highlight">${inputText}</span>`))
                                                      )
                                                      : //沒輸入關鍵字時，顯示前75個字，超過75個字顯示...
                                                      item.content.length > 60 ? parse(item.content.substring(0, 75) + `...`) : parse(item.content)*/
                                                }
                                                {/* //parseToText是將html轉成純文字，postTextLimit是將文字限制在某字數內，並且將搜尋到的文字用紅色標記。 */}
                                                {postTextLimit(parseToText(item.content, 'p7'), "")}
                                            </div>
                                        </div>
                                    </div>
                                )
                                :
                                <div className="noResult">查不到相關的文章</div>}
                            {/* //判斷是否顯示mask，props.isMask為true，就顯示block，否則顯示none。 */}
                            <div className='mask' style={{ display: isOpenSearch ? 'block' : 'none', width: '100%', height: '100%', background: '#ffffff91', position: 'absolute' }}></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bottom">
                <Footer />
            </div>
        </div>
    )
}

export default CategoryArticle