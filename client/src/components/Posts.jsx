import React, { useContext, useEffect, useRef, useState } from 'react'
import './posts.scss'
import useFetch from '../hooks/useFetch'
import Skeleton from './Skeleton'
import { OptionsContext } from '../context/OptionsContext'
import { API_URL_AWS, ENVIRONMENT, clear_Options } from '../constants/actionTypes'
import { Link } from 'react-router-dom'
import axios from 'axios'
import parse from 'html-react-parser'
import { parseToText, postTextLimit } from '../parse.js'
import { NO_ARTICLE, NO_ARTICLE_AND_NO_API } from '../constants/string.js'

const Posts = (props) => {
  const content = useRef(null)
  let inputTextFiler = "";
  const text = "大家平常有去探索一下長灘地區的餐廳嗎？我個人時常在長灘附近閒晃，\
  知道這裡漂亮的餐廳還真不少呢！所以在這裡找地方吃飯的時候，也真的十分容易選擇困難\
  症發作！"
  let { inputText, hashtag, type, category, dispatch } = useContext(OptionsContext)

  useEffect(() => {
    if (inputText.includes('#')) {
      //inputText分割，將#標籤後一個取出來，加入hashtag陣列，其他都加入inputText字串
      //但分割後就不知道原本的#標籤在哪裡了，所以要用正規表達式來分割，(?=#)代表以#為分割點，但不包含#
      const inputTextSplit = inputText.split(/(?=#)/)
      const inputTextSplit2 = inputTextSplit.map(item => item.split(' '))
      const inputTextSplit3 = inputTextSplit2.flat()
      //把有#字號的加入hashtag陣列，其他都加入inputText字串
      inputTextSplit3.forEach(item => {
        if (item.includes('#')) {
          hashtag.push(item.replace('#', ''))
        } else {
          inputTextFiler += item
        }
      })
    } else {
      inputTextFiler = inputText
    }

  }, [inputText])

  // const hashtagNoSharp = inputText.map(item => item.replace('#', ''))
  const [authData, setAuthData] = useState([])
  const [authLoading, setAuthLoading] = useState(false)
  // dispatch({type: clear_Options})
  const searchUrl = `${API_URL_AWS}/articles?${inputTextFiler !== '' ? "searchText=" + inputText + "&" : ""}${hashtag.length !== 0 ? "hashtags=" + hashtag + "&" : ""}${category.length !== 0 ? "category=" + category : ""}`
  // console.log(searchUrl)
  const { data, loading, error } = useFetch(props.authorUrl ? props.authorUrl : searchUrl)//props.authorUrl是User頁面傳過來的props

  useEffect(() => {
    setAuthLoading(true)
    const fetchData = async () => {
      const userData = await Promise.all(data.map(async (item, i) => { return await axios.get(`${API_URL_AWS}/users/find/${item.AuthorId}`) }))
      setAuthData(userData)
      setAuthLoading(false)
    }
    fetchData()
  }, [data])

  const options = {
    replace: (domNode) => {
      if (domNode.name === 'img') {
        // 跳過圖片節點，返回null
        console.log(domNode.attribs.src)
        return domNode.attribs.hidden = 'hidden';
      }
    },
  };

  return (
    <div className='posts' style={props.style}>
      <div className="postContainer" style={{ position: 'relative' }}>
        <div className="postWrapper" style={props.userPost}>
          {loading || authLoading ?
            <Skeleton type="postSkeleton" length={4} /> :
            data.length != 0 ?
              data.map((item, index) =>
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
                      {postTextLimit(parseToText(item.content, 'p7'), inputText)}
                    </div>
                  </div>
                </div>
              )
              :
              (ENVIRONMENT.status === 'production' ? //判斷是否為正式環境
                (API_URL_AWS === '' ? //判斷是否有API_URL_AWS
                  <div>
                    <div className="noResult">{NO_ARTICLE_AND_NO_API}</div>
                    <img src={`${process.env.PUBLIC_URL}/images/offline-removebg.png`} style={{ width: '100%', margintop: '1rem' }} alt="offlineImg" />
                  </div>
                  :
                  <div className="noResult">{NO_ARTICLE}</div>
                )
                :
                <div className="noResult">{NO_ARTICLE}</div>
              )
          }
          {/* //判斷是否顯示mask，props.isMask為true，就顯示block，否則顯示none。 */}
          <div className='mask' style={{ display: props.isMask ? 'block' : 'none', width: '100%', height: '100%', background: '#ffffff91', position: 'absolute' }}></div>
        </div>
      </div>
    </div>
  )
}

export default Posts